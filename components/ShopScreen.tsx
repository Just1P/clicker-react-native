import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { shopScreenStyles as styles, colors } from "../styles/FuturisticTheme";

const STORAGE_KEY = "team_clicker_preference";

const ShopScreen = ({ clickCount, setClickCount }) => {
  const [bonuses, setBonuses] = useState([
    {
      id: 1,
      name: "Auto-Clicker Basique",
      cost: 50,
      effect: 1,
      description: "Ajoute 1 clic automatique par seconde",
    },
    {
      id: 2,
      name: "Auto-Clicker Avancé",
      cost: 200,
      effect: 5,
      description: "Ajoute 5 clics automatiques par seconde",
    },
    {
      id: 3,
      name: "Hyper Clickeur",
      cost: 500,
      effect: 15,
      description: "Ajoute 15 clics automatiques par seconde",
    },
  ]);

  const [purchasedBonuses, setPurchasedBonuses] = useState([]);

  // Effet et fonctions existants...

  const canPurchase = (bonus) => clickCount >= bonus.cost;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Boutique Futuriste</Text>
        <Text style={styles.clickCountText}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color={colors.textSecondary}
          />{" "}
          Clics disponibles: {clickCount}
        </Text>

        <View style={styles.bonusesContainer}>
          <Text style={styles.sectionHeading}>Améliorations disponibles</Text>

          {bonuses.map((bonus) => (
            <View key={bonus.id} style={styles.bonusCard}>
              <View style={styles.bonusInfo}>
                <Text style={styles.bonusName}>{bonus.name}</Text>
                <Text style={styles.bonusDescription}>{bonus.description}</Text>
                <Text style={styles.bonusEffect}>
                  +{bonus.effect} clics/sec
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
                    +{bonus.effect} clics/sec
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
