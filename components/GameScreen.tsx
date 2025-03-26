import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../database";
import {
  gameScreenStyles as styles,
  colors,
} from "../assets/style/FuturisticTheme";
import { GameScreenProps, Team } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";

const STORAGE_KEY = "team_clicker_preference";
const CLICKS_STORAGE_KEY = "team_clicker_clicks";
const AUTO_CLICKER_THRESHOLD = 10;
const AUTO_CLICKER_STORAGE_KEY = "team_clicker_autoclicker";
const BONUSES_STORAGE_KEY = "team_clicker_bonuses";

interface Bonus {
  id: number;
  name: string;
  cost: number;
  effect: number;
  description: string;
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

  // Fonction pour charger les bonus et recalculer le taux d'auto-clics
  const loadBonusesAndCalculateRate = useCallback(async () => {
    try {
      console.log("Chargement des bonus...");
      const savedBonuses = await AsyncStorage.getItem(BONUSES_STORAGE_KEY);

      if (savedBonuses) {
        const parsedBonuses = JSON.parse(savedBonuses);
        setPurchasedBonuses(parsedBonuses);

        // Calculer le taux total des auto-clics à partir des bonus
        const totalRate = parsedBonuses.reduce(
          (total, bonus) => total + bonus.effect,
          0
        );
        console.log("Nouveau taux d'auto-clics calculé:", totalRate);
        setAutoClickRate(totalRate);
      } else {
        console.log("Aucun bonus trouvé");
        setPurchasedBonuses([]);
        setAutoClickRate(0);
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
        const savedState = await AsyncStorage.getItem(AUTO_CLICKER_STORAGE_KEY);
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
    // Activer l'auto-clicker quand le seuil est atteint
    if (clickCount >= AUTO_CLICKER_THRESHOLD && !autoClickerEnabled) {
      setAutoClickerEnabled(true);

      // Enregistrer l'état de l'auto-clicker
      try {
        AsyncStorage.setItem(AUTO_CLICKER_STORAGE_KEY, "enabled");
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de l'état de l'auto-clicker:",
          error
        );
      }

      // Afficher l'alerte seulement la première fois
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
    // Nettoyer tout intervalle existant
    if (autoClickIntervalRef.current) {
      clearInterval(autoClickIntervalRef.current);
      autoClickIntervalRef.current = null;
    }

    if (autoClickerEnabled && autoClickRate > 0) {
      console.log(
        "Démarrage de l'intervalle d'auto-clics avec un taux de",
        autoClickRate
      );
      // Créer un nouvel intervalle qui génère des clics pour l'ÉQUIPE seulement
      autoClickIntervalRef.current = setInterval(() => {
        // Mise à jour Firestore pour l'équipe
        updateFirestoreClicks(true);
      }, 1000); // Un cycle par seconde
    }

    // Nettoyage à la démontage
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
        // Mise à jour du document dans Firestore
        // Si c'est un auto-clic, utilisez le taux d'auto-clics comme valeur d'incrément
        const incrementValue = isAutoClick ? autoClickRate : 1;

        await updateDoc(doc(db, "teams", team), {
          clicks: increment(incrementValue),
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des clics:", error);
      }
    },
    [team, autoClickRate]
  );

  // Gérer le clic manuel
  const handleClick = useCallback(() => {
    // Vérifier le temps écoulé depuis le dernier clic pour éviter les doubles clics
    const now = Date.now();
    if (now - lastClickTime.current < 100) {
      return; // Ignorer les clics trop rapprochés
    }
    lastClickTime.current = now;

    // Animation du bouton
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

    // Vibration haptique
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Calculer le nouveau compte de clics personnels
    const newClickCount = (isNaN(clickCount) ? 0 : clickCount) + 1;

    // Mettre à jour le compteur et sauvegarder
    setClickCount(newClickCount);

    // Sauvegarde directe dans AsyncStorage pour éviter les pertes
    try {
      AsyncStorage.setItem(CLICKS_STORAGE_KEY, String(newClickCount));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du clic:", error);
    }

    // Mettre à jour Firestore
    updateFirestoreClicks(false);
  }, [clickCount, scale, setClickCount, updateFirestoreClicks]);

  // Calculer le total des clics personnels
  const totalPersonalClicks = isNaN(clickCount) ? 0 : clickCount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Équipe {team === "Rouge" ? "🔴 Rouge" : "🔵 Bleue"}
      </Text>

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
        <Text style={styles.subtitle}>
          <Ionicons name="people" size={18} color={colors.textSecondary} />{" "}
          Clics de l'équipe: {totalClicks[team]}
        </Text>
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

      <TouchableOpacity style={styles.resetButton} onPress={resetTeam}>
        <Text style={styles.resetButtonText}>
          <Ionicons name="sync" size={16} color={colors.textPrimary} /> Changer
          d'équipe
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameScreen;
