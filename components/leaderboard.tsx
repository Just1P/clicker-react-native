import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../database";
import {
  leaderboardStyles as styles,
  colors,
} from "../assets/style/FuturisticTheme";
import { Team } from "../types/types";

interface PlayerStats {
  name: string;
  team: Team;
  clicks: number;
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Team>("Rouge");
  const [players, setPlayers] = useState<PlayerStats[]>([]);

  // Charger les joueurs de l'équipe
  const loadTeamPlayers = useCallback(async (team: Team) => {
    try {
      // Requête pour obtenir les joueurs de l'équipe, triés par nombre de clics
      const playersQuery = query(
        collection(db, "players"),
        where("team", "==", team),
        orderBy("clicks", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(playersQuery);

      const teamPlayers: PlayerStats[] = querySnapshot.docs.map((doc) => ({
        name: doc.id, // Le nom du joueur est l'ID du document
        team: doc.data().team,
        clicks: doc.data().clicks || 0,
      }));

      setPlayers(teamPlayers);
    } catch (error) {
      console.error("Erreur lors du chargement des joueurs:", error);
    }
  }, []);

  // Charger les joueurs quand le composant monte ou que l'onglet change
  useEffect(() => {
    loadTeamPlayers(activeTab);
  }, [activeTab, loadTeamPlayers]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classement des Équipes</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Rouge" ? styles.activeTab : {}]}
          onPress={() => setActiveTab("Rouge")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Rouge" ? styles.activeTabText : {},
            ]}
          >
            Équipe Rouge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Bleu" ? styles.activeTab : {}]}
          onPress={() => setActiveTab("Bleu")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Bleu" ? styles.activeTabText : {},
            ]}
          >
            Équipe Bleue
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {players.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              Aucun joueur dans cette équipe
            </Text>
          </View>
        ) : (
          players.map((player, index) => (
            <View
              key={player.name}
              style={[
                styles.playerRow,
                player.team === "Rouge"
                  ? styles.redPlayerRow
                  : styles.bluePlayerRow,
              ]}
            >
              <Text style={[styles.rank, index < 3 ? styles.topRank : {}]}>
                {index + 1}
              </Text>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerStats}>
                  <Ionicons name="flash" size={14} color={colors.warning} />{" "}
                  {player.clicks} clics
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Leaderboard;
