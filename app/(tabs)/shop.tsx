import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, Text, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShopScreen from "../../components/ShopScreen";
import { appStyles, colors } from "../../assets/style/FuturisticTheme";
import { useFocusEffect } from "@react-navigation/native";

// Clé de stockage pour les clics personnels
const CLICKS_STORAGE_KEY = "team_clicker_clicks";

export default function Shop() {
  // État pour les clics personnels
  const [clickCount, setClickCount] = useState<number>(0);
  // État pour le chargement
  const [loading, setLoading] = useState<boolean>(true);

  // Charger le nombre de clics personnels au démarrage
  const loadClickCount = useCallback(async () => {
    try {
      console.log("Chargement des clics personnels...");
      const savedClicks = await AsyncStorage.getItem(CLICKS_STORAGE_KEY);
      console.log("Clics sauvegardés:", savedClicks);

      if (savedClicks) {
        const parsedClicks = parseInt(savedClicks, 10);
        if (!isNaN(parsedClicks)) {
          console.log("Nombre de clics chargé:", parsedClicks);
          setClickCount(parsedClicks);
        } else {
          // Si ce n'est pas un nombre valide, réinitialiser à 0
          console.log("Réinitialisation des clics à 0 (NaN détecté)");
          setClickCount(0);
          await AsyncStorage.setItem(CLICKS_STORAGE_KEY, "0");
        }
      } else {
        console.log("Aucun clic sauvegardé trouvé, initialisation à 0");
        setClickCount(0);
        await AsyncStorage.setItem(CLICKS_STORAGE_KEY, "0");
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des clics:", error);
      setLoading(false);
    }
  }, []);

  // Charger les clics au démarrage
  useEffect(() => {
    loadClickCount();
  }, [loadClickCount]);

  // Recharger les clics à chaque fois que l'écran obtient le focus
  useFocusEffect(
    useCallback(() => {
      loadClickCount();
      return () => {
        // Nettoyer si nécessaire
      };
    }, [loadClickCount])
  );

  // Mettre à jour le nombre de clics personnels
  const handleSetClickCount = useCallback(async (newCount: number) => {
    console.log("Mise à jour du nombre de clics:", newCount);

    // S'assurer que newCount est un nombre valide
    if (isNaN(newCount)) {
      newCount = 0;
    }

    setClickCount(newCount);

    try {
      await AsyncStorage.setItem(CLICKS_STORAGE_KEY, String(newCount));
      console.log("Clics sauvegardés avec succès:", newCount);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des clics:", error);
    }
  }, []);

  if (loading) {
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={appStyles.loadingText}>Chargement de la boutique...</Text>
      </View>
    );
  }

  return (
    <ShopScreen clickCount={clickCount} setClickCount={handleSetClickCount} />
  );
}
