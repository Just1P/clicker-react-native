import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { progressBarStyles as styles } from "../assets/style/FuturisticTheme";
import { ProgressBarProps } from "../types/types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  redPercentage,
  bluePercentage,
}) => {
  // Animation des largeurs
  const redWidth = useSharedValue(redPercentage);
  const blueWidth = useSharedValue(bluePercentage);

  // Mettre à jour les animations quand les pourcentages changent
  useEffect(() => {
    redWidth.value = withTiming(redPercentage, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    blueWidth.value = withTiming(bluePercentage, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [redPercentage, bluePercentage]);

  // Styles animés
  const redBarStyle = useAnimatedStyle(() => {
    return {
      width: `${redWidth.value}%`,
    };
  });

  const blueBarStyle = useAnimatedStyle(() => {
    return {
      width: `${blueWidth.value}%`,
    };
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[styles.progressBar, styles.redProgressBar, redBarStyle]}
      />
      <Animated.View
        style={[styles.progressBar, styles.blueProgressBar, blueBarStyle]}
      />
    </View>
  );
};

export default ProgressBar;
