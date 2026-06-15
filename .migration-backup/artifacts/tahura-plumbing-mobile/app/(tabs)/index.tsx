import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Image,
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
import { PHONE, WHATSAPP_URL } from "@/constants/content";

const { width } = Dimensions.get("window");

const HERO_IMAGE = require("../../assets/images/Screenshot_20260604-014744_Maps_1780521632105.jpg");

const STATS = [
  { value: "1200+", label: "Projects" },
  { value: "4.9★", label: "Rating" },
  { value: "15+", label: "Years" },
  { value: "24/7", label: "Available" },
];

const TRUST = [
  "Open 24 Hours",
  "Professional Experts",
  "Fast Response",
  "Quality Workmanship",
  "Customer Satisfaction",
  "Certified & Insured",
];

const SERVICES_PREVIEW = [
  { icon: "droplet" as const, name: "Leak Detection" },
  { icon: "tool" as const, name: "Pipe Repair" },
  { icon: "refresh-cw" as const, name: "Drain Cleaning" },
  { icon: "zap" as const, name: "Emergency" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const press = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const handleCall = () => {
    press();
    Linking.openURL(`tel:${PHONE}`);
  };

  const handleWhatsApp = () => {
    press();
    Linking.openURL(WHATSAPP_URL);
  };

  const handleBook = () => {
    press();
    router.push("/(tabs)/book");
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
      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image source={HERO_IMAGE} style={styles.heroImg} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(11,11,11,0.7)", "#0B0B0B"]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.heroContent,
            { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 20 },
          ]}
        >
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Available 24/7 · 4.9 ★ Rated</Text>
          </View>
          <Text style={styles.heroSub}>Professional</Text>
          <Text style={styles.heroTitle}>Plumbing Services</Text>
          <Text style={styles.heroCaption}>
            Expert solutions for homes, offices & commercial properties.
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionCall,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleCall}
        >
          <Feather name="phone" size={18} color="#fff" />
          <Text style={styles.actionCallText}>Call</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionWA,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleWhatsApp}
        >
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.actionWAText}>WhatsApp</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBook,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleBook}
        >
          <Feather name="calendar" size={18} color="#0B0B0B" />
          <Text style={styles.actionBookText}>Book Now</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {STATS.map((s, i) => (
          <React.Fragment key={s.value}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.gold }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
            {i < STATS.length - 1 && (
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Services Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Our Services</Text>
          <Pressable onPress={() => { press(); router.push("/(tabs)/services"); }}>
            <Text style={[styles.seeAll, { color: colors.gold }]}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.servicesGrid}>
          {SERVICES_PREVIEW.map((svc) => (
            <Pressable
              key={svc.name}
              style={({ pressed }) => [
                styles.svcCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => { press(); router.push("/(tabs)/services"); }}
            >
              <View style={[styles.svcIconWrap, { backgroundColor: colors.surfaceHighlight }]}>
                <Feather name={svc.icon} size={22} color={colors.gold} />
              </View>
              <Text style={[styles.svcName, { color: colors.foreground }]}>{svc.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Trust Strip */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Why Choose Us</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trustScroll}>
          {TRUST.map((item) => (
            <View key={item} style={[styles.trustChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="check-circle" size={14} color={colors.gold} />
              <Text style={[styles.trustText, { color: colors.foreground }]}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* About Card */}
      <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.aboutBadge, { backgroundColor: colors.surfaceHighlight }]}>
          <Text style={[styles.aboutBadgeNum, { color: colors.gold }]}>15+</Text>
          <Text style={[styles.aboutBadgeLabel, { color: colors.mutedForeground }]}>Years</Text>
        </View>
        <View style={styles.aboutText}>
          <Text style={[styles.aboutTitle, { color: colors.foreground }]}>
            Maharashtra's Most Trusted{" "}
            <Text style={{ color: colors.gold }}>Plumbing Experts</Text>
          </Text>
          <Text style={[styles.aboutBody, { color: colors.mutedForeground }]}>
            Based in MIDC Chilkalthana, Chhatrapati Sambhajinagar — serving homes,
            offices, and commercial properties across Maharashtra with precision
            and reliability.
          </Text>
        </View>
      </View>

      {/* Emergency Banner */}
      <Pressable
        style={({ pressed }) => [
          styles.emergencyBanner,
          { borderColor: colors.gold, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={handleCall}
      >
        <LinearGradient
          colors={["#1A1400", "#0B0B0B"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Feather name="zap" size={24} color={colors.gold} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.emergencyTitle, { color: colors.gold }]}>Emergency Plumbing?</Text>
          <Text style={[styles.emergencyBody, { color: colors.mutedForeground }]}>
            Call now — we respond within 45–60 minutes, 24/7
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.gold} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },
  heroWrap: { height: 420, position: "relative" },
  heroImg: { width: "100%", height: "100%", position: "absolute" },
  heroContent: { padding: 24, justifyContent: "flex-end", flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212,175,55,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4CAF50", marginRight: 8 },
  badgeText: { color: "#D4AF37", fontSize: 12, fontFamily: "Inter_500Medium" },
  heroSub: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_400Regular" },
  heroTitle: { color: "#D4AF37", fontSize: 36, fontFamily: "Inter_700Bold", lineHeight: 42 },
  heroCaption: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 8 },
  actionsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: -20 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionCall: { backgroundColor: "#1A1A1A", borderWidth: 1, borderColor: "#2A2A2A" },
  actionCallText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  actionWA: { backgroundColor: "#25D366" },
  actionWAText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  actionBook: { backgroundColor: "#D4AF37" },
  actionBookText: { color: "#0B0B0B", fontFamily: "Inter_700Bold", fontSize: 14 },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: 1, marginVertical: 4 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  servicesGrid: { flexDirection: "row", gap: 10 },
  svcCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  svcIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  svcName: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  trustScroll: { marginTop: 4 },
  trustChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
  },
  trustText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  aboutCard: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  aboutBadge: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  aboutBadgeNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  aboutBadgeLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  aboutText: { flex: 1 },
  aboutTitle: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 20, marginBottom: 6 },
  aboutBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  emergencyBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  emergencyTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  emergencyBody: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
});
