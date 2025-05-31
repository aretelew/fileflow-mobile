import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: 'Files',
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }} />
      <Tabs.Screen name="upload" options={{
        title: 'Upload',
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="upload" color={color} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Settings',
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
      }} />
    </Tabs>
  );
}