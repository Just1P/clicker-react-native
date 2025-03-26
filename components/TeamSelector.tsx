import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  teamSelectorStyles as styles,
  colors,
  usernameStyles,
} from "../assets/style/FuturisticTheme";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../database";
import { Team } from "../types/types";

const STORAGE_KEY = "team_clicker_preference";
const USERNAME_KEY = "team_clicker_username";

interface TeamSelectorProps {
  chooseTeam: (team: Team) => void;
  currentTeam?: Team | null;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  chooseTeam,
  currentTeam = null,
}) => {
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  // Charger le nom d'utilisateur existant au démarrage
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem(USERNAME_KEY);
        if (savedUsername) {
          setStoredUsername(savedUsername);
          setUsername(savedUsername);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du nom d'utilisateur:", error);
      }
    };

    loadUsername();
  }, []);

  // Gérer la sélection d'équipe
  const handleTeamSelection = async (team: Team) => {
    // Feedback haptique
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    console.log("Équipe sélectionnée:", team);

    // Stocker temporairement l'équipe sélectionnée
    setSelectedTeam(team);

    // Vérifier si un nom d'utilisateur existe déjà
    if (storedUsername) {
      // Si l'utilisateur a déjà un pseudo, on utilise celui-là et on finalise la sélection
      finalizeTeamSelection(team, storedUsername);
    } else {
      // Sinon, on ouvre le modal pour demander un pseudo
      setUsernameModalVisible(true);
    }
  };

  // Finaliser la sélection d'équipe
  const finalizeTeamSelection = async (team: Team, name: string) => {
    try {
      console.log(
        "Finalisation de la sélection d'équipe:",
        team,
        "avec le pseudo:",
        name
      );

      // Enregistrer l'équipe en AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, team);

      // Enregistrer le pseudo
      await AsyncStorage.setItem(USERNAME_KEY, name);
      setStoredUsername(name);

      // Mettre à jour Firestore
      await updateTeamData(team, name);

      // Informer le parent que l'équipe a été choisie
      chooseTeam(team);
    } catch (error) {
      console.error(
        "Erreur lors de la finalisation de la sélection d'équipe:",
        error
      );
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'enregistrement de votre choix. Veuillez réessayer."
      );
    }
  };

  // Mettre à jour les données d'équipe dans Firestore
  const updateTeamData = async (team: Team, playerName: string) => {
    try {
      // Référence au document de l'équipe
      const teamRef = doc(db, "teams", team);

      // Mettre à jour le document (ou le créer s'il n'existe pas)
      await setDoc(
        teamRef,
        {
          name: team,
          members: increment(1),
          // On pourrait ajouter d'autres données si nécessaire
        },
        { merge: true }
      );

      // Ajouter le joueur à la collection des joueurs
      const playerRef = doc(db, "players", playerName);
      await setDoc(
        playerRef,
        {
          name: playerName,
          team: team,
          joinedAt: new Date().toISOString(),
          clicks: 0,
        },
        { merge: true }
      );

      console.log("Données d'équipe mises à jour avec succès dans Firestore");
    } catch (error) {
      console.error(
        "Erreur Firebase lors de la mise à jour des données d'équipe:",
        error
      );
    }
  };

  // Soumettre le nom d'utilisateur
  const handleUsernameSubmit = () => {
    // Valider le nom d'utilisateur
    if (!username.trim()) {
      setUsernameError("Veuillez entrer un pseudo");
      return;
    }

    if (username.length < 3) {
      setUsernameError("Le pseudo doit contenir au moins 3 caractères");
      return;
    }

    if (username.length > 15) {
      setUsernameError("Le pseudo doit contenir au maximum 15 caractères");
      return;
    }

    // Masquer le modal
    setUsernameModalVisible(false);

    // Finaliser la sélection avec l'équipe stockée et le nouveau pseudo
    if (selectedTeam) {
      finalizeTeamSelection(selectedTeam, username.trim());
    }
  };

  // Afficher un titre spécial pour le changement d'équipe
  const title = currentTeam ? "Changer d'équipe" : "Choisissez votre équipe";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

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
        {currentTeam
          ? "Attention : changer d'équipe réinitialisera vos statistiques personnelles."
          : "Choisissez un camp et commencez à cliquer pour aider votre équipe à gagner!"}
      </Text>

      {/* Modal pour entrer le pseudo */}
      <Modal
        visible={usernameModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={usernameStyles.modalContainer}>
          <View style={usernameStyles.formContainer}>
            <Text style={usernameStyles.title}>Entrez votre pseudo</Text>
            <Text style={usernameStyles.description}>
              Comment souhaitez-vous être connu dans la bataille des clics?
            </Text>

            <TextInput
              style={usernameStyles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Votre pseudo"
              placeholderTextColor={colors.textMuted}
              maxLength={15}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {usernameError ? (
              <Text style={usernameStyles.errorText}>{usernameError}</Text>
            ) : null}

            <View style={usernameStyles.buttonContainer}>
              <TouchableOpacity
                style={usernameStyles.button}
                onPress={handleUsernameSubmit}
              >
                <Text style={usernameStyles.buttonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeamSelector;
