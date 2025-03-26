import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../database";
import TeamSelector from "../../components/TeamSelector";
import GameScreen from "../../components/GameScreen";
import ProgressBar from "../../components/ProgressBar";
import Stats from "../../components/Stats";
import { appStyles, colors } from "../../assets/style/FuturisticTheme";
import { Team, TeamStats } from "../../types/types";
import { useFocusEffect } from "@react-navigation/native";

// Définition des clés de stockage
const STORAGE_KEY = "team_clicker_preference";
const CLICKS_STORAGE_KEY = "team_clicker_clicks";

export default function Index() {
  // État pour l'équipe sélectionnée
  const [team, setTeam] = useState<Team | null>(null);

  // État pour le chargement
  const [loading, setLoading] = useState<boolean>(true);

  // État pour les clics des équipes
  const [totalClicks, setTotalClicks] = useState<TeamStats>({
    Rouge: 0,
    Bleu: 0,
  });

  // État pour les clics personnels
  const [clickCount, setClickCount] = useState<number>(0);

  // Charger les préférences depuis AsyncStorage
  const loadPreferences = useCallback(async () => {
    try {
      // Récupérer l'équipe sélectionnée
      const savedTeam = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTeam) {
        setTeam(savedTeam as Team);
      }

      // Récupérer le nombre de clics
      const savedClicks = await AsyncStorage.getItem(CLICKS_STORAGE_KEY);
      if (savedClicks) {
        const parsedClicks = parseInt(savedClicks, 10);
        // Vérifier que c'est un nombre valide
        if (!isNaN(parsedClicks)) {
          setClickCount(parsedClicks);
        } else {
          // Si ce n'est pas un nombre valide, réinitialiser à 0
          setClickCount(0);
          await AsyncStorage.setItem(CLICKS_STORAGE_KEY, "0");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des préférences:", error);
      setLoading(false);
    }
  }, []);

  // Charger les préférences au démarrage
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Recharger les clics à chaque fois que l'écran obtient le focus
  useFocusEffect(
    useCallback(() => {
      const loadClickCount = async () => {
        try {
          const savedClicks = await AsyncStorage.getItem(CLICKS_STORAGE_KEY);
          if (savedClicks) {
            const parsedClicks = parseInt(savedClicks, 10);
            if (!isNaN(parsedClicks)) {
              setClickCount(parsedClicks);
            } else {
              // Si ce n'est pas un nombre valide, réinitialiser à 0
              setClickCount(0);
              await AsyncStorage.setItem(CLICKS_STORAGE_KEY, "0");
            }
          }
        } catch (error) {
          console.error("Erreur lors du rechargement des clics:", error);
        }
      };

      loadClickCount();

      return () => {
        // Nettoyer si nécessaire
      };
    }, [])
  );

  // S'abonner aux mises à jour des clics des équipes depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teams"),
      (snapshot) => {
        const newTotalClicks = { Rouge: 0, Bleu: 0 };

        snapshot.docs.forEach((doc) => {
          const teamId = doc.id as Team;
          const data = doc.data();

          if (teamId === "Rouge" || teamId === "Bleu") {
            newTotalClicks[teamId] = data.clicks || 0;
          }
        });

        setTotalClicks(newTotalClicks);
      },
      (error) => {
        console.error("Erreur lors de l'abonnement aux équipes:", error);
      }
    );

    // Nettoyage de l'abonnement
    return () => unsubscribe();
  }, []);

  // Réinitialiser l'équipe
  const resetTeam = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTeam(null);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de l'équipe:", error);
    }
  }, []);

  // Mettre à jour le nombre de clics
  const handleSetClickCount = useCallback(async (newCount: number) => {
    // S'assurer que newCount est un nombre valide
    if (isNaN(newCount)) {
      newCount = 0;
    }

    setClickCount(newCount);

    try {
      await AsyncStorage.setItem(CLICKS_STORAGE_KEY, newCount.toString());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des clics:", error);
    }
  }, []);

  // Afficher l'écran de chargement
  if (loading) {
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={appStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={appStyles.safeArea}>
      <View style={appStyles.container}>
        <Stats totalClicks={totalClicks} />
        <ProgressBar
          redPercentage={
            totalClicks.Rouge + totalClicks.Bleu > 0
              ? (totalClicks.Rouge / (totalClicks.Rouge + totalClicks.Bleu)) *
                100
              : 50
          }
          bluePercentage={
            totalClicks.Rouge + totalClicks.Bleu > 0
              ? (totalClicks.Bleu / (totalClicks.Rouge + totalClicks.Bleu)) *
                100
              : 50
          }
        />
        <View style={appStyles.mainContent}>
          {!team ? (
            <TeamSelector chooseTeam={setTeam} />
          ) : (
            <GameScreen
              team={team}
              totalClicks={totalClicks}
              clickCount={clickCount}
              setClickCount={handleSetClickCount}
              resetTeam={resetTeam}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
