import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { FAQS, PHONE, WHATSAPP_URL, ADDRESS, MAPS_URL, PHONE_DISPLAY } from "@/constants/content";

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const press = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const toggleFaq = (i: number) => {
    press();
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Contact Us</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          We're available 24/7 for your plumbing needs
        </Text>
      </View>

      {/* Emergency Banner */}
      <Pressable
        style={({ pressed }) => [
          styles.emergencyBanner,
          { borderColor: colors.gold, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => { press(); Linking.openURL(`tel:${PHONE}`); }}
      >
        <View style={styles.emergencyLeft}>
          <Feather name="zap" size={20} color={colors.gold} />
          <Text style={[styles.emergencyTitle, { color: colors.gold }]}>Emergency? Call Now</Text>
        </View>
        <Text style={[styles.emergencyNum, { color: colors.foreground }]}>{PHONE_DISPLAY}</Text>
      </Pressable>

      {/* Contact Action Cards */}
      <View style={styles.actionCards}>
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => { press(); Linking.openURL(`tel:${PHONE}`); }}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#1A2A1A" }]}>
            <Feather name="phone" size={22} color="#4CAF50" />
          </View>
          <Text style={[styles.actionLabel, { color: colors.mutedForeground }]}>Call Us</Text>
          <Text style={[styles.actionValue, { color: colors.foreground }]}>{PHONE_DISPLAY}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => { press(); Linking.openURL(WHATSAPP_URL); }}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#1A2A1A" }]}>
            <Feather name="message-circle" size={22} color="#25D366" />
          </View>
          <Text style={[styles.actionLabel, { color: colors.mutedForeground }]}>WhatsApp</Text>
          <Text style={[styles.actionValue, { color: colors.foreground }]}>Chat Now</Text>
        </Pressable>
      </View>

      {/* Address */}
      <Pressable
        style={({ pressed }) => [
          styles.addressCard,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => { press(); Linking.openURL(MAPS_URL); }}
      >
        <View style={[styles.addressIconWrap, { backgroundColor: colors.surfaceHighlight }]}>
          <Feather name="map-pin" size={22} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.addressTitle, { color: colors.foreground }]}>Our Location</Text>
          <Text style={[styles.addressText, { color: colors.mutedForeground }]}>{ADDRESS}</Text>
        </View>
        <Feather name="external-link" size={16} color={colors.mutedForeground} />
      </Pressable>

      {/* Business Hours */}
      <View style={[styles.hoursCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.hoursHeader}>
          <Feather name="clock" size={18} color={colors.gold} />
          <Text style={[styles.hoursTitle, { color: colors.foreground }]}>Business Hours</Text>
        </View>
        <View style={[styles.hoursDivider, { backgroundColor: colors.border }]} />
        <View style={styles.hoursRow}>
          <Text style={[styles.hoursDay, { color: colors.mutedForeground }]}>Monday – Sunday</Text>
          <View style={[styles.openBadge, { backgroundColor: "rgba(76,175,80,0.15)", borderColor: "rgba(76,175,80,0.3)" }]}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>Open 24 Hours</Text>
          </View>
        </View>
        <View style={styles.hoursRow}>
          <Text style={[styles.hoursDay, { color: colors.mutedForeground }]}>Public Holidays</Text>
          <Text style={[styles.hoursVal, { color: colors.foreground }]}>Available</Text>
        </View>
      </View>

      {/* Services Areas */}
      <View style={[styles.areasCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.hoursHeader}>
          <Feather name="map" size={18} color={colors.gold} />
          <Text style={[styles.hoursTitle, { color: colors.foreground }]}>Service Areas</Text>
        </View>
        <View style={[styles.hoursDivider, { backgroundColor: colors.border }]} />
        <Text style={[styles.areasText, { color: colors.mutedForeground }]}>
          Chhatrapati Sambhajinagar · MIDC Chilkalthana · Cidco · Garkheda ·
          Waluj · Jalna Road · Beed Bypass · and 25+ more localities
        </Text>
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={[styles.faqTitle, { color: colors.foreground }]}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => (
          <Pressable
            key={i}
            style={[
              styles.faqItem,
              {
                backgroundColor: colors.card,
                borderColor: openFaq === i ? colors.gold : colors.border,
              },
            ]}
            onPress={() => toggleFaq(i)}
          >
            <View style={styles.faqQ}>
              <Text style={[styles.faqQText, { color: colors.foreground, flex: 1 }]}>{faq.q}</Text>
              <Feather
                name={openFaq === i ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.mutedForeground}
              />
            </View>
            {openFaq === i && (
              <View style={[styles.faqA, { borderTopColor: colors.border }]}>
                <Text style={[styles.faqAText, { color: colors.mutedForeground }]}>{faq.a}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {},
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  emergencyBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(212,175,55,0.06)",
  },
  emergencyLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  emergencyTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  emergencyNum: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionCards: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  actionValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  addressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addressIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  addressTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  addressText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  hoursCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  hoursTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  hoursDivider: { height: 1 },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  hoursDay: { fontSize: 14, fontFamily: "Inter_400Regular" },
  hoursVal: { fontSize: 14, fontFamily: "Inter_500Medium" },
  openBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4CAF50" },
  openText: { color: "#4CAF50", fontSize: 12, fontFamily: "Inter_500Medium" },
  areasCard: {
    marginHorizontal: 20,
    marginBottom: 28,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  areasText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, padding: 16 },
  faqSection: { paddingHorizontal: 20 },
  faqTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 14 },
  faqItem: { borderWidth: 1, borderRadius: 12, marginBottom: 10, overflow: "hidden" },
  faqQ: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  faqQText: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  faqA: { borderTopWidth: 1, padding: 16 },
  faqAText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
});
