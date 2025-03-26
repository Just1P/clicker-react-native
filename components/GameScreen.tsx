import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../database";
import {
  gameScreenStyles as styles,
  colors,
} from "../assets/style/FuturisticTheme";
import { GameScreenProps, Team } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";
import { STORAGE_KEYS } from "../constants/storageKey";

const AUTO_CLICKER_THRESHOLD = 10;

interface Bonus {
  id: number;
  name: string;
  cost: number;
  effect: number;
  description: string;
  type: "autoClicker" | "clickMultiplier" | "teamBoost" | "specialAbility";
}

interface PlayerActivity {
  name: string;
  clicks: number;
}

const GameScreen: React.FC<GameScreenProps> = ({
  team,
  totalClicks,
  clickCount,
  setClickCount,
  resetTeam,
}) => {
  // Animation pour le bouton
  const scale = useSharedValue(1);

  // Style d'animation pour le bouton
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // États pour les activités des joueurs
  const [playerActivities, setPlayerActivities] = useState<PlayerActivity[]>(
    []
  );

  // Vérifier si l'auto-clicker est débloqué
  const [autoClickerEnabled, setAutoClickerEnabled] = useState(false);

  // Taux d'auto-clics par seconde - calculé à partir des bonus achetés
  const [autoClickRate, setAutoClickRate] = useState(0);

  // Stocker les bonus achetés
  const [purchasedBonuses, setPurchasedBonuses] = useState<Bonus[]>([]);

  // Référence pour suivre si l'auto-clicker a été annoncé
  const autoClickerAnnounced = useRef(false);

  // Référence pour l'intervalle d'auto-click
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Référence pour suivre le dernier timestamp de clic
  const lastClickTime = useRef(0);

  const [clickMultiplier, setClickMultiplier] = useState(1);

  // Nouvelle fonction pour suivre l'activité des joueurs en temps réel
  useEffect(() => {
    // Vérifier si une équipe est sélectionnée
    if (!team) return;

    // Créer une requête pour suivre les joueurs de l'équipe, triés par clics récents
    const playersQuery = query(
      collection(db, "players"),
      where("team", "==", team),
      orderBy("clicks", "desc"),
      limit(10)
    );

    // Établir un listener en temps réel
    const unsubscribe = onSnapshot(
      playersQuery,
      (snapshot) => {
        const activePlayersData: PlayerActivity[] = snapshot.docs.map(
          (doc) => ({
            name: doc.id,
            clicks: doc.data().clicks || 0,
          })
        );

        setPlayerActivities(activePlayersData);
      },
      (error) => {
        console.error("Erreur lors du suivi des joueurs:", error);
      }
    );

    // Nettoyer le listener à la démontage
    return () => unsubscribe();
  }, [team]);

  // Fonction pour charger les bonus et recalculer le taux d'auto-clics
  const loadBonusesAndCalculateRate = useCallback(async () => {
    try {
      console.log("Chargement des bonus...");
      const savedBonuses = await AsyncStorage.getItem(STORAGE_KEYS.BONUSES);

      if (savedBonuses) {
        const parsedBonuses = JSON.parse(savedBonuses);
        setPurchasedBonuses(parsedBonuses);

        // Calculer le taux total des auto-clics
        const totalAutoClicks = parsedBonuses
          .filter((bonus: Bonus) => bonus.type === "autoClicker")
          .reduce((total: number, bonus: Bonus) => total + bonus.effect, 0);

        // Calculer le multiplicateur de clics
        const clickMultiplier = parsedBonuses
          .filter((bonus: Bonus) => bonus.type === "clickMultiplier")
          .reduce((total: number, bonus: Bonus) => total * bonus.effect, 1);

        console.log("Nouveau taux d'auto-clics calculé:", totalAutoClicks);
        console.log("Multiplicateur de clics:", clickMultiplier);

        setAutoClickRate(totalAutoClicks);
        setClickMultiplier(clickMultiplier);
      } else {
        console.log("Aucun bonus trouvé");
        setPurchasedBonuses([]);
        setAutoClickRate(0);
        setClickMultiplier(1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des bonus:", error);
    }
  }, []);

  // Charger l'état de l'auto-clicker et les bonus au démarrage
  useEffect(() => {
    const loadAutoClickerState = async () => {
      try {
        // Charger l'état de l'auto-clicker
        const savedState = await AsyncStorage.getItem(
          STORAGE_KEYS.AUTO_CLICKER
        );
        if (savedState === "enabled") {
          setAutoClickerEnabled(true);
        }

        // Charger les bonus achetés
        await loadBonusesAndCalculateRate();
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'état de l'auto-clicker:",
          error
        );
      }
    };

    loadAutoClickerState();
  }, [loadBonusesAndCalculateRate]);

  // Recharger les bonus à chaque fois que l'écran obtient le focus
  useFocusEffect(
    useCallback(() => {
      console.log("Écran GameScreen a le focus - rechargement des bonus");
      loadBonusesAndCalculateRate();

      return () => {
        // Nettoyer si nécessaire
      };
    }, [loadBonusesAndCalculateRate])
  );

  // Vérifier le débloquage de l'auto-clicker
  useEffect(() => {
    if (clickCount >= AUTO_CLICKER_THRESHOLD && !autoClickerEnabled) {
      setAutoClickerEnabled(true);

      try {
        AsyncStorage.setItem(STORAGE_KEYS.AUTO_CLICKER, "enabled");
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de l'état de l'auto-clicker:",
          error
        );
      }

      if (!autoClickerAnnounced.current) {
        Alert.alert(
          "Auto-Clicker Débloqué!",
          "Vous avez débloqué l'auto-clicker! Vous pouvez maintenant acheter des améliorations dans la boutique pour générer des clics automatiques pour votre équipe."
        );
        autoClickerAnnounced.current = true;
      }
    }
  }, [clickCount, autoClickerEnabled]);

  // Effet pour l'auto-clicker - UNIQUEMENT pour les clics d'équipe
  useEffect(() => {
    if (autoClickIntervalRef.current) {
      clearInterval(autoClickIntervalRef.current);
      autoClickIntervalRef.current = null;
    }

    if (autoClickerEnabled && autoClickRate > 0) {
      console.log(
        "Démarrage de l'intervalle d'auto-clics avec un taux de",
        autoClickRate
      );
      autoClickIntervalRef.current = setInterval(() => {
        updateFirestoreClicks(true);
      }, 1000);
    }

    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
        autoClickIntervalRef.current = null;
      }
    };
  }, [autoClickerEnabled, autoClickRate]);

  // Enregistrer le clic dans Firestore
  const updateFirestoreClicks = useCallback(
    async (isAutoClick: boolean = false) => {
      try {
        // Récupérer le nom d'utilisateur
        const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);

        // Si pas de nom d'utilisateur, ne pas continuer
        if (!username) {
          console.error("Nom d'utilisateur non trouvé");
          return;
        }

        // Si c'est un auto-clic, utilisez le taux d'auto-clics comme valeur d'incrément
        const baseIncrementValue = isAutoClick ? autoClickRate : 1;

        // Appliquer le multiplicateur de clics
        const incrementValue = Math.floor(baseIncrementValue * clickMultiplier);

        // Mise à jour des clics de l'équipe
        await updateDoc(doc(db, "teams", team), {
          clicks: increment(incrementValue),
        });

        // Mise à jour des clics du joueur
        await updateDoc(doc(db, "players", username), {
          clicks: increment(incrementValue),
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des clics:", error);
      }
    },
    [team, autoClickRate, clickMultiplier]
  );

  // Gérer le clic manuel
  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 100) {
      return;
    }
    lastClickTime.current = now;

    scale.value = withSequence(
      withTiming(0.95, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      withTiming(1.05, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      withTiming(1, {
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newClickCount =
      (isNaN(clickCount) ? 0 : clickCount) + 1 * clickMultiplier;

    setClickCount(newClickCount);

    try {
      AsyncStorage.setItem(STORAGE_KEYS.CLICKS, String(newClickCount));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du clic:", error);
    }

    updateFirestoreClicks(false);
  }, [
    clickCount,
    scale,
    setClickCount,
    updateFirestoreClicks,
    clickMultiplier,
  ]);

  // Fonction de déconnexion
  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter et réinitialiser toutes vos données ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnecter",
          style: "destructive",
          onPress: async () => {
            try {
              // Supprimer toutes les clés liées à l'utilisateur
              await AsyncStorage.multiRemove([
                STORAGE_KEYS.TEAM,
                STORAGE_KEYS.CLICKS,
                STORAGE_KEYS.AUTO_CLICKER,
                STORAGE_KEYS.BONUSES,
                STORAGE_KEYS.USERNAME,
              ]);

              // Réinitialiser l'état local
              setClickCount(0);
              setAutoClickerEnabled(false);
              setAutoClickRate(0);
              setClickMultiplier(1);
              setPurchasedBonuses([]);

              // Nettoyer l'intervalle d'auto-clic
              if (autoClickIntervalRef.current) {
                clearInterval(autoClickIntervalRef.current);
                autoClickIntervalRef.current = null;
              }

              // Appeler la fonction de réinitialisation de l'équipe
              resetTeam();
            } catch (error) {
              console.error("Erreur lors de la déconnexion:", error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la déconnexion. Veuillez réessayer."
              );
            }
          },
        },
      ]
    );
  }, [resetTeam, setClickCount]);

  // Calculer le total des clics personnels
  const totalPersonalClicks = isNaN(clickCount) ? 0 : clickCount;

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <Text style={styles.subtitle}>
          <Ionicons name="person" size={18} color={colors.textSecondary} />{" "}
          Clics personnels: {totalPersonalClicks}
        </Text>
        {autoClickRate > 0 && (
          <Text style={styles.subtitle}>
            <Ionicons name="flash" size={18} color={colors.success} />{" "}
            Auto-clics: +{autoClickRate}/sec pour l'équipe
          </Text>
        )}
        {clickMultiplier > 1 && (
          <Text style={styles.subtitle}>
            <Ionicons name="rocket" size={18} color={colors.warning} />{" "}
            Multiplicateur de clics: x{clickMultiplier}
          </Text>
        )}
        <Text style={styles.subtitle}>
          <Ionicons name="people" size={18} color={colors.textSecondary} />{" "}
          Clics de l'équipe: {totalClicks[team]}
        </Text>
      </View>

      {/* Nouveau bloc pour afficher l'activité des joueurs */}
      <View style={styles.playerActivityContainer}>
        <Text style={styles.sectionHeading}>Activité des joueurs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {playerActivities.map((player, index) => (
            <View
              key={player.name}
              style={[
                styles.playerActivityCard,
                {
                  backgroundColor:
                    team === "Rouge"
                      ? colors.redSecondary
                      : colors.blueSecondary,
                },
              ]}
            >
              <Text style={styles.playerActivityName}>{player.name}</Text>
              <Text style={styles.playerActivityClicks}>
                {player.clicks} clics
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          style={[
            styles.clickButton,
            team === "Rouge" ? styles.redClickButton : styles.blueClickButton,
          ]}
          onPress={handleClick}
        >
          <Text style={styles.clickButtonText}>CLIQUEZ!</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetTeam}>
          <Text style={styles.resetButtonText}>
            <Ionicons name="sync" size={16} color={colors.textPrimary} />{" "}
            Changer d'équipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.resetButton,
            { backgroundColor: colors.error, marginLeft: 10 },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.resetButtonText}>
            <Ionicons name="log-out" size={16} color={colors.textPrimary} />{" "}
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameScreen;
