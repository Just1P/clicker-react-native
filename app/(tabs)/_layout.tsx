import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../constants/storageKey";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [hasAvailableUpgrades, setHasAvailableUpgrades] = useState(false);

  // Vérifier s'il y a des améliorations disponibles
  const checkAvailableUpgrades = async () => {
    try {
      const [clickCount, purchasedBonuses] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CLICKS),
        AsyncStorage.getItem(STORAGE_KEYS.BONUSES),
      ]);

      // Liste des bonus disponibles avec leurs coûts
      const bonuses = [
        { id: 1, cost: 50 }, // Drone de Clic Basique
        { id: 2, cost: 200 }, // Essaim de Micro-Robots
        { id: 3, cost: 500 }, // IA de Clic Avancée
        { id: 4, cost: 100 }, // Amplificateur de Clic
        { id: 5, cost: 300 }, // Booster Quantique
        { id: 6, cost: 250 }, // Motivation d'Équipe
        { id: 7, cost: 400 }, // Bouclier de Synchronisation
        { id: 8, cost: 600 }, // Rayon de Conversion
        { id: 9, cost: 1000 }, // Lance-Clics Orbital
      ];

      const parsedClickCount = parseInt(clickCount || "0", 10);
      const parsedPurchasedBonuses = purchasedBonuses
        ? JSON.parse(purchasedBonuses)
        : [];

      // Vérifier s'il y a des bonus non achetés que l'utilisateur peut acheter
      const upgradeable = bonuses.some(
        (bonus) =>
          parsedClickCount >= bonus.cost &&
          !parsedPurchasedBonuses.some(
            (pb: { id: number }) => pb.id === bonus.id
          )
      );

      setHasAvailableUpgrades(upgradeable);
    } catch (error) {
      console.error("Erreur lors de la vérification des améliorations:", error);
    }
  };

  // Vérifier les améliorations au montage et à chaque focus
  useEffect(() => {
    checkAvailableUpgrades();
  }, []);

  // Vérifier à chaque fois que l'écran obtient le focus
  useFocusEffect(
    React.useCallback(() => {
      checkAvailableUpgrades();
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              <IconSymbol size={28} name="paperplane.fill" color={color} />
              {hasAvailableUpgrades && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                    borderRadius: 10,
                    width: 10,
                    height: 10,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Classement",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="trophy.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
