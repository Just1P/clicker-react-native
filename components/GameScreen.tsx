import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../database";
import { gameScreenStyles as styles, colors } from "../styles/FuturisticTheme";
import { GameScreenProps, Team } from "../types/types";

const STORAGE_KEY = "team_clicker_preference";

const GameScreen: React.FC<GameScreenProps> = ({
  team,
  totalClicks,
  clickCount,
  setClickCount,
  resetTeam,
}) => {
  // Logique existante...

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Équipe {team === "Rouge" ? "🔴 Rouge" : "🔵 Bleue"}
      </Text>

      <View style={styles.scoreCard}>
        <Text style={styles.subtitle}>
          <Ionicons name="person" size={18} color={colors.textSecondary} />{" "}
          Clics personnels: {clickCount}
        </Text>
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
