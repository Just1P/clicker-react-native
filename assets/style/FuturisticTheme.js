// FuturisticTheme.js
import { Platform, StatusBar, StyleSheet } from "react-native";

// Palette de couleurs futuriste
export const colors = {
  // Couleurs principales
  background: "#080b1a", // Fond sombre
  backgroundLight: "#111a33", // Fond un peu plus clair pour les cartes
  backgroundAccent: "#1a2040", // Pour les éléments secondaires

  // Couleurs d'équipe avec aspect néon
  redPrimary: "#ff2d55", // Rouge néon vif
  redGlow: "rgba(255, 45, 85, 0.5)", // Lueur rouge
  redDark: "#c41e3a", // Rouge plus sombre

  bluePrimary: "#00c3ff", // Bleu cyan lumineux
  blueGlow: "rgba(0, 195, 255, 0.5)", // Lueur bleue
  blueDark: "#0077cc", // Bleu plus sombre

  // Couleurs pour les textes et accents
  textPrimary: "#ffffff", // Texte principal
  textSecondary: "#a0a8c0", // Texte secondaire
  textMuted: "#5d6483", // Texte discret

  // Accents
  accent: "#7c4dff", // Violet pour les accents (boutons neutres, etc.)
  accentGlow: "rgba(124, 77, 255, 0.4)", // Lueur pour les accents

  // États
  success: "#00d68f", // Vert néon pour les succès
  warning: "#ffba08", // Jaune/Orange pour les alertes
};

// Styles de base partagés entre composants
export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 77, 255, 0.2)",
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 16,
    textShadowColor: "rgba(255, 255, 255, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  buttonBase: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  redButton: {
    backgroundColor: colors.redPrimary,
    shadowColor: colors.redPrimary,
    borderWidth: 2,
    borderColor: "rgba(255, 45, 85, 0.3)",
  },
  blueButton: {
    backgroundColor: colors.bluePrimary,
    shadowColor: colors.bluePrimary,
    borderWidth: 2,
    borderColor: "rgba(0, 195, 255, 0.3)",
  },
  accentButton: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    borderWidth: 2,
    borderColor: "rgba(124, 77, 255, 0.3)",
  },
});

// Styles spécifiques par composant
export const appStyles = StyleSheet.create({
  safeArea: {
    ...baseStyles.container,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navBar: {
    backgroundColor: colors.backgroundAccent,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    height: 60,
    paddingBottom: 8,
  },
  navBarLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  navBarIcon: {
    marginBottom: -4,
  },
  loadingContainer: {
    ...baseStyles.container,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    color: colors.accent,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export const statsStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  redTeamText: {
    color: colors.redPrimary,
    textShadowColor: colors.redGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  blueTeamText: {
    color: colors.bluePrimary,
    textShadowColor: colors.blueGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

export const progressBarStyles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    width: "90%",
    height: 32,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  progressBar: {
    height: "100%",
  },
  redProgressBar: {
    backgroundColor: colors.redPrimary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: colors.redGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  blueProgressBar: {
    backgroundColor: colors.bluePrimary,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: colors.blueGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});

export const teamSelectorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    ...baseStyles.title,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  redButton: {
    ...baseStyles.buttonBase,
    ...baseStyles.redButton,
    marginBottom: 20,
    height: 70,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowColor: colors.redGlow,
  },
  blueButton: {
    ...baseStyles.buttonBase,
    ...baseStyles.blueButton,
    height: 70,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowColor: colors.blueGlow,
  },
  buttonText: {
    ...baseStyles.buttonText,
    fontSize: 22,
  },
  teamLogo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  vsText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.textMuted,
    marginVertical: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 24,
    marginHorizontal: 24,
  },
});

export const gameScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    ...baseStyles.title,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: "center",
  },
  scoreCard: {
    ...baseStyles.card,
    alignItems: "center",
    marginBottom: 32,
    width: "90%",
    maxWidth: 360,
  },
  clickButton: {
    ...baseStyles.buttonBase,
    width: 180,
    height: 180,
    borderRadius: 90,
    marginVertical: 30,
  },
  redClickButton: {
    backgroundColor: colors.redPrimary,
    shadowColor: colors.redPrimary,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  blueClickButton: {
    backgroundColor: colors.bluePrimary,
    shadowColor: colors.bluePrimary,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  clickButtonText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  resetButton: {
    ...baseStyles.buttonBase,
    ...baseStyles.accentButton,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    ...baseStyles.buttonText,
    fontSize: 16,
  },
  effectsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
});

export const shopScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    ...baseStyles.title,
    textAlign: "center",
    marginTop: 16,
  },
  clickCountText: {
    fontSize: 20,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  bonusesContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  bonusCard: {
    ...baseStyles.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  bonusInfo: {
    flex: 1,
  },
  bonusName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  bonusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bonusCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.warning,
  },
  buyButton: {
    ...baseStyles.buttonBase,
    ...baseStyles.accentButton,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  buyButtonText: {
    ...baseStyles.buttonText,
    fontSize: 14,
  },
  unavailableBuyButton: {
    ...baseStyles.buttonBase,
    backgroundColor: colors.backgroundAccent,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    opacity: 0.6,
  },
  sectionHeading: {
    ...baseStyles.heading,
    marginTop: 20,
    marginLeft: 16,
    color: colors.textSecondary,
  },
  ownedBonusesContainer: {
    marginTop: 24,
  },
  ownedBonusCard: {
    ...baseStyles.card,
    backgroundColor: "rgba(124, 77, 255, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
  },
  bonusEffect: {
    fontSize: 15,
    color: colors.success,
    fontWeight: "bold",
  },
});
