import React from "react";
import { View, Text } from "react-native";
import { statsStyles as styles } from "../styles/FuturisticTheme";
import { StatsProps } from "../types/types";

const Stats: React.FC<StatsProps> = ({ totalClicks }) => {
  const redPercentage =
    totalClicks.Rouge + totalClicks.Bleu > 0
      ? (totalClicks.Rouge / (totalClicks.Rouge + totalClicks.Bleu)) * 100
      : 50;
  const bluePercentage =
    totalClicks.Rouge + totalClicks.Bleu > 0
      ? (totalClicks.Bleu / (totalClicks.Rouge + totalClicks.Bleu)) * 100
      : 50;

  return (
    <View style={styles.statsContainer}>
      <Text style={[styles.statsText, styles.redTeamText]}>
        🔴 {totalClicks.Rouge.toLocaleString()} ({redPercentage.toFixed(1)}%)
      </Text>
      <Text style={[styles.statsText, styles.blueTeamText]}>
        🔵 {totalClicks.Bleu.toLocaleString()} ({bluePercentage.toFixed(1)}%)
      </Text>
    </View>
  );
};

export default Stats;
