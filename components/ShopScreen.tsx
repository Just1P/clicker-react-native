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
  type: "autoClicker" | "clickMultiplier" | "teamBoost" | "specialAbility";
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
    // Auto-Clickers
    {
      id: 1,
      name: "Drone de Clic Basique",
      cost: 50,
      effect: 1,
      description: "Un petit drone qui clique automatiquement",
      type: "autoClicker",
    },
    {
      id: 2,
      name: "Essaim de Micro-Robots",
      cost: 200,
      effect: 5,
      description: "Un essaim de micro-robots qui cliquent en coordination",
      type: "autoClicker",
    },
    {
      id: 3,
      name: "IA de Clic Avancée",
      cost: 500,
      effect: 15,
      description: "Une intelligence artificielle optimisée pour le clic",
      type: "autoClicker",
    },

    // Multiplicateurs de Clic
    {
      id: 4,
      name: "Amplificateur de Clic",
      cost: 100,
      effect: 2,
      description: "Chaque clic manuel génère le double de points",
      type: "clickMultiplier",
    },
    {
      id: 5,
      name: "Booster Quantique",
      cost: 300,
      effect: 5,
      description: "Multiplie la puissance de chaque clic par 5",
      type: "clickMultiplier",
    },

    // Boosters d'Équipe
    {
      id: 6,
      name: "Motivation d'Équipe",
      cost: 250,
      effect: 10,
      description: "Boost temporaire de la vitesse de clic de toute l'équipe",
      type: "teamBoost",
    },
    {
      id: 7,
      name: "Bouclier de Synchronisation",
      cost: 400,
      effect: 20,
      description: "Protège les clics de l'équipe contre les ralentissements",
      type: "teamBoost",
    },

    // Capacités Spéciales
    {
      id: 8,
      name: "Rayon de Conversion",
      cost: 600,
      effect: 30,
      description: "Convertit un petit pourcentage des clics adverses",
      type: "specialAbility",
    },
    {
      id: 9,
      name: "Lance-Clics Orbital",
      cost: 1000,
      effect: 50,
      description: "Un bombardement de clics depuis l'orbite",
      type: "specialAbility",
    },
  ]);

  const [purchasedBonuses, setPurchasedBonuses] = useState<Bonus[]>([]);
  const [team, setTeam] = useState<string | null>(null);

  // S'assurer que clickCount est un nombre valide
  const validClickCount = isNaN(clickCount) ? 0 : clickCount;

  // Notification pour indiquer l'activation immédiate des améliorations
  const [showActivationNotice, setShowActivationNotice] =
    useState<boolean>(false);

  const calculateTotalAutoClicks = useCallback(() => {
    return purchasedBonuses
      .filter((bonus) => bonus.type === "autoClicker")
      .reduce((total, bonus) => total + bonus.effect, 0);
  }, [purchasedBonuses]);

  // Calculer le multiplicateur de clics
  const calculateClickMultiplier = useCallback(() => {
    return purchasedBonuses
      .filter((bonus) => bonus.type === "clickMultiplier")
      .reduce((total, bonus) => total * bonus.effect, 1);
  }, [purchasedBonuses]);

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

  // Appliquer un booster d'équipe
  const applyTeamBoost = useCallback(
    async (bonus: Bonus) => {
      if (!team) return;

      try {
        // Mettre à jour Firestore avec un boost temporaire pour l'équipe
        await updateDoc(doc(db, "teams", team), {
          temporaryBoost: increment(bonus.effect),
          boostExpiration: new Date(Date.now() + 60000), // Boost valable 1 minute
        });

        // Notification du boost
        Alert.alert(
          "Boost d'Équipe!",
          `${bonus.name} active! Votre équipe bénéficie d'un boost temporaire de ${bonus.effect} points.`
        );
      } catch (error) {
        console.error("Erreur lors de l'application du boost d'équipe:", error);
      }
    },
    [team]
  );

  // Appliquer une capacité spéciale
  const applySpecialAbility = useCallback(
    async (bonus: Bonus) => {
      if (!team) return;

      try {
        // Selon le type de capacité, différents effets
        switch (bonus.id) {
          case 8: // Rayon de Conversion
            await updateDoc(
              doc(db, "teams", team === "Rouge" ? "Bleu" : "Rouge"),
              {
                clicks: increment(-bonus.effect), // Réduire les clics de l'équipe adverse
              }
            );
            break;

          case 9: // Lance-Clics Orbital
            await updateDoc(doc(db, "teams", team), {
              clicks: increment(bonus.effect * 2), // Double effet pour le boost orbital
            });
            break;
        }

        // Notification de la capacité spéciale
        Alert.alert(
          "Capacité Spéciale!",
          `${bonus.name} a été utilisée avec succès !`
        );
      } catch (error) {
        console.error(
          "Erreur lors de l'application de la capacité spéciale:",
          error
        );
      }
    },
    [team]
  );

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

      // Traitement spécifique selon le type de bonus
      switch (bonus.type) {
        case "autoClicker":
          updateFirestoreWithAutoClicks(bonus);
          break;
        case "teamBoost":
          applyTeamBoost(bonus);
          break;
        case "specialAbility":
          applySpecialAbility(bonus);
          break;
      }

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
      applyTeamBoost,
      applySpecialAbility,
    ]
  );

  // Grouper les bonus par type
  const groupedBonuses = {
    "Auto-Clickers": bonuses.filter((b) => b.type === "autoClicker"),
    "Multiplicateurs de Clic": bonuses.filter(
      (b) => b.type === "clickMultiplier"
    ),
    "Boosters d'Équipe": bonuses.filter((b) => b.type === "teamBoost"),
    "Capacités Spéciales": bonuses.filter((b) => b.type === "specialAbility"),
  };

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

        {calculateTotalAutoClicks() > 0 && (
          <Text style={[styles.clickCountText, { color: colors.success }]}>
            <Ionicons name="flash" size={20} color={colors.success} />{" "}
            Auto-clics: +{calculateTotalAutoClicks()} par seconde pour votre
            équipe
          </Text>
        )}

        {calculateClickMultiplier() > 1 && (
          <Text style={[styles.clickCountText, { color: colors.warning }]}>
            <Ionicons name="rocket" size={20} color={colors.warning} />{" "}
            Multiplicateur de clic: x{calculateClickMultiplier()}
          </Text>
        )}

        <View style={styles.bonusesContainer}>
          {Object.entries(groupedBonuses).map(
            ([categoryName, categoryBonuses]) => (
              <View key={categoryName}>
                <Text style={styles.sectionHeading}>{categoryName}</Text>

                {categoryBonuses
                  .filter(
                    (bonus) =>
                      !purchasedBonuses.some((pb) => pb.id === bonus.id)
                  )
                  .map((bonus) => (
                    <View key={bonus.id} style={styles.bonusCard}>
                      <View style={styles.bonusInfo}>
                        <Text style={styles.bonusName}>{bonus.name}</Text>
                        <Text style={styles.bonusDescription}>
                          {bonus.description}
                        </Text>
                        {bonus.type === "autoClicker" && (
                          <Text style={styles.bonusEffect}>
                            +{bonus.effect} clics/sec pour l'équipe
                          </Text>
                        )}
                        {bonus.type === "clickMultiplier" && (
                          <Text style={styles.bonusEffect}>
                            Multiplie les clics manuels par {bonus.effect}
                          </Text>
                        )}
                        {(bonus.type === "teamBoost" ||
                          bonus.type === "specialAbility") && (
                          <Text style={styles.bonusEffect}>
                            Effet spécial de {bonus.effect} points
                          </Text>
                        )}
                        <Text style={styles.bonusCost}>
                          <Ionicons
                            name="flash"
                            size={16}
                            color={colors.warning}
                          />{" "}
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
              </View>
            )
          )}

          {purchasedBonuses.length > 0 && (
            <View style={styles.ownedBonusesContainer}>
              <Text style={styles.sectionHeading}>Vos améliorations</Text>
              {purchasedBonuses.map((bonus, index) => (
                <View key={index} style={styles.ownedBonusCard}>
                  <Text style={styles.bonusName}>
                    {bonus.name || `Bonus ${index + 1}`}
                  </Text>
                  {bonus.type === "autoClicker" && (
                    <Text style={styles.bonusEffect}>
                      +{bonus.effect} clics/sec pour l'équipe
                    </Text>
                  )}
                  {bonus.type === "clickMultiplier" && (
                    <Text style={styles.bonusEffect}>
                      Multiplie les clics manuels par {bonus.effect}
                    </Text>
                  )}
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
