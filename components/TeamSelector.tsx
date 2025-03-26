import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { teamSelectorStyles as styles } from "../styles/FuturisticTheme";

const STORAGE_KEY = "team_clicker_preference";

const TeamSelector = ({ chooseTeam }) => {
  // Logique existante...

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez votre équipe</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.redButton}
          onPress={() => handleTeamSelection("Rouge")}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="flame" size={22} color="#fff" /> Équipe Rouge
          </Text>
        </TouchableOpacity>

        <Text style={styles.vsText}>VS</Text>

        <TouchableOpacity
          style={styles.blueButton}
          onPress={() => handleTeamSelection("Bleu")}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="water" size={22} color="#fff" /> Équipe Bleue
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Choisissez un camp et commencez à cliquer pour aider votre équipe à
        gagner!
      </Text>
    </View>
  );
};

export default TeamSelector;
