import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SERVICES } from "@/constants/content";

type FeatherIcon = React.ComponentProps<typeof Feather>["name"];

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleService = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/(tabs)/book", params: { service: name } });
  };

  const renderItem = ({ item }: { item: typeof SERVICES[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={() => handleService(item.name)}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
        <Feather name={item.icon as FeatherIcon} size={26} color={colors.gold} />
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
        <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
      </View>
      <View style={[styles.bookBtn, { borderColor: colors.gold }]}>
        <Text style={[styles.bookBtnText, { color: colors.gold }]}>Book</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Our Services</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Tap any service to book an appointment
        </Text>
      </View>

      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!SERVICES.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  bookBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bookBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
