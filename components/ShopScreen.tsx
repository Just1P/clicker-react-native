import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  shopScreenStyles as styles,
  colors,
} from "../assets/style/FuturisticTheme";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../database";

const STORAGE_KEY = "team_clicker_preference";
const BONUSES_STORAGE_KEY = "team_clicker_bonuses";
const TEAM_STORAGE_KEY = "team_clicker_preference";

// Types pour TypeScript
interface Bonus {
  id: number;
  name: string;
  cost: number;
  effect: number;
  description: string;
}

interface ShopScreenProps {
  clickCount: number;
  setClickCount: (count: number) => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({
  clickCount,
  setClickCount,
}) => {
  const [bonuses, setBonuses] = useState<Bonus[]>([
    {
      id: 1,
      name: "Auto-Clicker Basique",
      cost: 50,
      effect: 1,
      description: "Ajoute 1 clic automatique par seconde pour votre équipe",
    },
    {
      id: 2,
      name: "Auto-Clicker Avancé",
      cost: 200,
      effect: 5,
      description: "Ajoute 5 clics automatiques par seconde pour votre équipe",
    },
    {
      id: 3,
      name: "Hyper Clickeur",
      cost: 500,
      effect: 15,
      description: "Ajoute 15 clics automatiques par seconde pour votre équipe",
    },
  ]);

  const [purchasedBonuses, setPurchasedBonuses] = useState<Bonus[]>([]);
  const [team, setTeam] = useState<string | null>(null);

  // S'assurer que clickCount est un nombre valide
  const validClickCount = isNaN(clickCount) ? 0 : clickCount;

  // Notification pour indiquer l'activation immédiate des améliorations
  const [showActivationNotice, setShowActivationNotice] =
    useState<boolean>(false);

  // Charger l'équipe actuelle
  useEffect(() => {
    const loadTeam = async () => {
      try {
        console.log("Chargement de l'équipe...");
        const savedTeam = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
        if (savedTeam) {
          setTeam(savedTeam);
          console.log("Équipe chargée:", savedTeam);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'équipe:", error);
      }
    };

    loadTeam();
  }, []);

  // Charger les bonus achetés au démarrage
  useEffect(() => {
    const loadPurchasedBonuses = async () => {
      try {
        console.log("Chargement des bonus achetés...");
        const savedBonuses = await AsyncStorage.getItem(BONUSES_STORAGE_KEY);
        if (savedBonuses) {
          const parsedBonuses = JSON.parse(savedBonuses);
          setPurchasedBonuses(parsedBonuses);
          console.log("Bonus chargés:", parsedBonuses.length);
        } else {
          console.log("Aucun bonus trouvé");
          setPurchasedBonuses([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des bonus:", error);
      }
    };

    loadPurchasedBonuses();
  }, []);

  // Sauvegarde des bonus achetés
  const savePurchasedBonuses = useCallback(async (newBonuses: Bonus[]) => {
    try {
      console.log("Sauvegarde des bonus:", newBonuses.length);
      await AsyncStorage.setItem(
        BONUSES_STORAGE_KEY,
        JSON.stringify(newBonuses)
      );

      // Activer la notification pour indiquer que les améliorations sont actives immédiatement
      setShowActivationNotice(true);

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowActivationNotice(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des bonus:", error);
    }
  }, []);

  // Calculer l'effet total des auto-clickers
  const calculateTotalEffect = useCallback(() => {
    return purchasedBonuses.reduce((total, bonus) => total + bonus.effect, 0);
  }, [purchasedBonuses]);

  // Mettre à jour Firestore avec les auto-clics
  const updateFirestoreWithAutoClicks = useCallback(
    async (bonus: Bonus) => {
      if (!team) return;

      try {
        // Mettre à jour les clics de l'équipe dans Firestore
        await updateDoc(doc(db, "teams", team), {
          clicks: increment(bonus.effect),
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des auto-clics:", error);
      }
    },
    [team]
  );

  // Vérifier si on peut acheter un bonus
  const canPurchase = useCallback(
    (bonus: Bonus) => {
      return validClickCount >= bonus.cost;
    },
    [validClickCount]
  );

  // Acheter un bonus
  const purchaseBonus = useCallback(
    (bonus: Bonus) => {
      if (!canPurchase(bonus)) return;

      // Feedback haptique
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Réduire le nombre de clics
      const newClickCount = validClickCount - bonus.cost;
      setClickCount(newClickCount);

      // Ajouter le bonus à la liste des bonus achetés
      const newPurchasedBonuses = [...purchasedBonuses, bonus];
      setPurchasedBonuses(newPurchasedBonuses);

      // Sauvegarder les bonus achetés
      savePurchasedBonuses(newPurchasedBonuses);

      // Mettre à jour Firestore avec les effets des auto-clics
      updateFirestoreWithAutoClicks(bonus);

      // Afficher une notification
      Alert.alert(
        "Amélioration achetée!",
        `Vous avez acheté "${bonus.name}" pour ${bonus.cost} clics. Cette amélioration est active immédiatement!`,
        [{ text: "Super!" }]
      );
    },
    [
      validClickCount,
      purchasedBonuses,
      canPurchase,
      setClickCount,
      savePurchasedBonuses,
      updateFirestoreWithAutoClicks,
    ]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {showActivationNotice && (
        <View style={styles.activationNotice}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.activationNoticeText}>
            Amélioration activée immédiatement!
          </Text>
        </View>
      )}

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Boutique Futuriste</Text>
        <Text style={styles.clickCountText}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color={colors.textSecondary}
          />{" "}
          Clics disponibles: {validClickCount}
        </Text>

        {calculateTotalEffect() > 0 && (
          <Text style={[styles.clickCountText, { color: colors.success }]}>
            <Ionicons name="flash" size={20} color={colors.success} />{" "}
            Auto-clics: +{calculateTotalEffect()} par seconde pour votre équipe
          </Text>
        )}

        <View style={styles.bonusesContainer}>
          <Text style={styles.sectionHeading}>Améliorations disponibles</Text>

          {bonuses
            .filter(
              (bonus) => !purchasedBonuses.some((pb) => pb.id === bonus.id)
            )
            .map((bonus) => (
              <View key={bonus.id} style={styles.bonusCard}>
                <View style={styles.bonusInfo}>
                  <Text style={styles.bonusName}>{bonus.name}</Text>
                  <Text style={styles.bonusDescription}>
                    {bonus.description}
                  </Text>
                  <Text style={styles.bonusEffect}>
                    +{bonus.effect} clics/sec pour l'équipe
                  </Text>
                  <Text style={styles.bonusCost}>
                    <Ionicons name="flash" size={16} color={colors.warning} />{" "}
                    {bonus.cost} clics
                  </Text>
                </View>
                <TouchableOpacity
                  style={
                    canPurchase(bonus)
                      ? styles.buyButton
                      : styles.unavailableBuyButton
                  }
                  onPress={() => purchaseBonus(bonus)}
                  disabled={!canPurchase(bonus)}
                >
                  <Text style={styles.buyButtonText}>ACHETER</Text>
                </TouchableOpacity>
              </View>
            ))}

          {purchasedBonuses.length > 0 && (
            <View style={styles.ownedBonusesContainer}>
              <Text style={styles.sectionHeading}>Vos améliorations</Text>
              {purchasedBonuses.map((bonus, index) => (
                <View key={index} style={styles.ownedBonusCard}>
                  <Text style={styles.bonusName}>
                    {bonus.name || `Bonus ${index + 1}`}
                  </Text>
                  <Text style={styles.bonusEffect}>
                    +{bonus.effect} clics/sec pour l'équipe
                  </Text>
                </View>
              ))}
            </View>
          )}

          {bonuses.filter(
            (bonus) => !purchasedBonuses.some((pb) => pb.id === bonus.id)
          ).length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Vous avez acheté toutes les améliorations disponibles !
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
