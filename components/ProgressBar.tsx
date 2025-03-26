import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { progressBarStyles as styles } from "../assets/style/FuturisticTheme";
import { ProgressBarProps } from "../types/types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  redPercentage,
  bluePercentage,
}) => {
  // Logique existante...

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, styles.redProgressBar]} />
      <Animated.View style={[styles.progressBar, styles.blueProgressBar]} />
    </View>
  );
};

export default ProgressBar;
