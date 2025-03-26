import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import TeamSelector from "../../components/TeamSelector";
import GameScreen from "../../components/GameScreen";
import ShopScreen from "../../components/ShopScreen";
import ProgressBar from "../../components/ProgressBar";
import Stats from "../../components/Stats";
import { appStyles, colors } from "../../assets/style/FuturisticTheme";

const STORAGE_KEY = "team_clicker_preference";
const Tab = createBottomTabNavigator();

const App = () => {
  // État existant...

  if (loading) {
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={appStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.accent,
          background: colors.background,
          card: colors.backgroundAccent,
          text: colors.textPrimary,
          border: "rgba(255, 255, 255, 0.1)",
          notification: colors.redPrimary,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: appStyles.navBar,
          tabBarLabelStyle: appStyles.navBarLabel,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          headerStyle: {
            backgroundColor: colors.backgroundAccent,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 255, 255, 0.1)",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: colors.textPrimary,
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Game") {
              iconName = focused
                ? "game-controller"
                : "game-controller-outline";
            } else if (route.name === "Shop") {
              iconName = focused ? "cart" : "cart-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                style={appStyles.navBarIcon}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Game" options={{ title: "Clicker" }}>
          {() => (
            <SafeAreaView style={appStyles.safeArea}>
              <View style={appStyles.container}>
                <Stats totalClicks={totalClicks} />
                <ProgressBar
                  redPercentage={
                    totalClicks.Rouge + totalClicks.Bleu > 0
                      ? (totalClicks.Rouge /
                          (totalClicks.Rouge + totalClicks.Bleu)) *
                        100
                      : 50
                  }
                  bluePercentage={
                    totalClicks.Rouge + totalClicks.Bleu > 0
                      ? (totalClicks.Bleu /
                          (totalClicks.Rouge + totalClicks.Bleu)) *
                        100
                      : 50
                  }
                />
                <View style={appStyles.mainContent}>
                  {!team ? (
                    <TeamSelector chooseTeam={setTeam} />
                  ) : (
                    <GameScreen
                      team={team}
                      totalClicks={totalClicks}
                      clickCount={clickCount}
                      setClickCount={setClickCount}
                      resetTeam={resetTeam}
                    />
                  )}
                </View>
              </View>
            </SafeAreaView>
          )}
        </Tab.Screen>
        <Tab.Screen name="Shop" options={{ title: "Boutique" }}>
          {() => (
            <ShopScreen clickCount={clickCount} setClickCount={setClickCount} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
