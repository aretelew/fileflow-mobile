import React from "react";
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();
  
  const SettingItem = ({ 
    icon, 
    title, 
    onPress, 
    showArrow = true, 
    rightComponent = null 
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-4 bg-white"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-8 h-8 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={20} color="#666" />
      </View>
      <Text className="flex-1 text-base text-gray-800">{title}</Text>
      {rightComponent || (showArrow && (
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      ))}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide px-4 py-2 mt-6 mb-2">
      {title}
    </Text>
  );

  const [loginNotifications, setLoginNotifications] = React.useState(false);
  const [transactionNotifications, setTransactionNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [fingerPrint, setFingerPrint] = React.useState(true);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 mt-5">
        <Text className="text-5xl text-center font-semibold">Settings</Text>

        {/* General Section */}
        <SectionHeader title="General" />
        <View className="bg-white rounded-xl mx-4 mb-2 overflow-hidden shadow-sm">
          <SettingItem
            icon="person-circle-outline"
            title="Edit profile"
            onPress={() => console.log("Edit profile pressed")}
          />
        </View>

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View className="bg-white rounded-xl mx-4 mb-2 overflow-hidden shadow-sm">
          <SettingItem
            icon="card-outline"
            title="Upgrade Account"
            onPress={() => console.log("Upgrade Account pressed")}
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="speedometer-outline"
            title="Account Limit"
            onPress={() => console.log("Account Limit pressed")}
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="document-text-outline"
            title="Account Statement"
            onPress={() => console.log("Account Statement pressed")}
          />
        </View>

        {/* Preference Section */}
        <SectionHeader title="Preference" />
        <View className="bg-white rounded-xl mx-4 mb-2 overflow-hidden shadow-sm">
          <SettingItem
            icon="refresh-outline"
            title="Login notification"
            onPress={() => setLoginNotifications(!loginNotifications)}
            showArrow={false}
            rightComponent={
              <Switch
                value={loginNotifications}
                onValueChange={() => setLoginNotifications(!loginNotifications)}
              />
            }
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="happy-outline"
            title="Transaction notification"
            onPress={() => setTransactionNotifications(!transactionNotifications)}
            showArrow={false}
            rightComponent={
              <Switch
                value={transactionNotifications}
                onValueChange={() => setTransactionNotifications(!transactionNotifications)}
              />
            }
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            onPress={() => setDarkMode(!darkMode)}
            showArrow={false}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={() => setDarkMode(!darkMode)}
              />
            }
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="settings-outline"
            title="Enable Finger-Print"
            onPress={() => setFingerPrint(!fingerPrint)}
            showArrow={false}
            rightComponent={
              <Switch 
                value={fingerPrint} 
                onValueChange={() => setFingerPrint(!fingerPrint)} 
              />
            }
          />
        </View>

        {/* Security Section */}
        <SectionHeader title="Security" />
        <View className="bg-white rounded-xl mx-4 mb-6 overflow-hidden shadow-sm">
          <SettingItem
            icon="refresh-circle-outline"
            title="Change transaction Pin"
            onPress={() => console.log("Change transaction Pin pressed")}
          />
        </View>

        {/* Storage and Appearance moved to Account section for better organization */}
        <SectionHeader title="App Settings" />
        <View className="bg-white rounded-xl mx-4 mb-6 overflow-hidden shadow-sm">
          <SettingItem
            icon="color-palette-outline"
            title="Appearance"
            onPress={() => router.push("/appearance" as any)}
          />
          <View className="border-t border-gray-100" />
          <SettingItem
            icon="archive-outline"
            title="Storage"
            onPress={() => console.log("Storage pressed")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}