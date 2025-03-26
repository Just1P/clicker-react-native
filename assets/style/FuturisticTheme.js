import { StyleSheet, Platform, StatusBar } from "react-native";

// Définition des couleurs
export const colors = {
  // Couleurs principales
  background: "#050A18",
  backgroundAccent: "#0A1428",
  backgroundLight: "#111a33",
  accent: "#00E5FF",
  accentDark: "#00B8CC",

  // Couleurs de texte
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textMuted: "#808080",

  // Couleurs d'équipe
  redPrimary: "#FF334E",
  redSecondary: "#FF687F",
  redGlow: "rgba(255, 45, 85, 0.5)",
  redDark: "#c41e3a",

  bluePrimary: "#3366FF",
  blueSecondary: "#668AFF",
  blueGlow: "rgba(0, 195, 255, 0.5)",
  blueDark: "#0077cc",

  // Couleurs supplémentaires
  success: "#00E676",
  warning: "#FFEA00",
  error: "#FF1744",

  // Couleurs de gradient
  gradientStart: "#050A18",
  gradientEnd: "#0A1428",
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  // Styles communs
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  smallText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonOutlineText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  // Styles pour joueur et pseudo
  playerTag: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  playerTeamIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  redTeamIndicator: {
    backgroundColor: colors.redPrimary,
  },
  blueTeamIndicator: {
    backgroundColor: colors.bluePrimary,
  },
  // Styles pour auto-clicker
  autoClickerBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  autoClickerText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

// Styles pour les statistiques
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
  autoClickerBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  autoClickerText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
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
  activationNotice: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 230, 118, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.success,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activationNoticeText: {
    color: colors.success,
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 14,
  },
});

// Styles pour l'écran de login/pseudo
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 320,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: colors.textPrimary,
    padding: 16,
    fontSize: 18,
    width: "100%",
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});

// Styles pour les notifications d'événements
export const notificationStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  redNotification: {
    borderLeftColor: colors.redPrimary,
  },
  blueNotification: {
    borderLeftColor: colors.bluePrimary,
  },
  closeButton: {
    padding: 8,
  },
});

// Animation styles pour les effets de particules
export const particleStyles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    borderRadius: 4,
    opacity: 0.8,
  },
  redParticle: {
    backgroundColor: colors.redPrimary,
  },
  blueParticle: {
    backgroundColor: colors.bluePrimary,
  },
});

// Styles pour le tableau des meilleurs joueurs
export const leaderboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    ...baseStyles.title,
    marginBottom: 0,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: colors.background,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  redPlayerRow: {
    borderLeftColor: colors.redPrimary,
  },
  bluePlayerRow: {
    borderLeftColor: colors.bluePrimary,
  },
  rank: {
    width: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
  },
  topRank: {
    color: colors.warning,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  playerStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  clickCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyListText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
  },
});

// Styles pour le composant pseudonyme
export const usernameStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5, 10, 24, 0.9)",
  },
  formContainer: {
    width: "85%",
    maxWidth: 360,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
  },
});

// Styles pour les effets et animations
export const effectsStyles = StyleSheet.create({
  clickEffect: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  redClickEffect: {
    backgroundColor: "rgba(255, 45, 85, 0.2)",
    borderWidth: 2,
    borderColor: colors.redPrimary,
  },
  blueClickEffect: {
    backgroundColor: "rgba(0, 195, 255, 0.2)",
    borderWidth: 2,
    borderColor: colors.bluePrimary,
  },
  achievementUnlocked: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
