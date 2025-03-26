import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { progressBarStyles as styles } from "../styles/FuturisticTheme";
import { ProgressBarProps } from "../types/types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  redPercentage,
  bluePercentage,
}) => {
  // Logique existante...

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[styles.progressBar, styles.redProgressBar, animatedRedBarStyle]}
      />
      <Animated.View
        style={[
          styles.progressBar,
          styles.blueProgressBar,
          animatedBlueBarStyle,
        ]}
      />
    </View>
  );
};

export default ProgressBar;
