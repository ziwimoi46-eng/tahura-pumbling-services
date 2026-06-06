import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SERVICES, PHONE } from "@/constants/content";

const SERVICE_NAMES = SERVICES.map((s) => s.name);

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 AM – 12:00 PM", icon: "sun" as const },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 5:00 PM", icon: "cloud" as const },
  { id: "evening", label: "Evening", time: "5:00 PM – 9:00 PM", icon: "moon" as const },
  { id: "emergency", label: "Emergency", time: "Any time, ASAP", icon: "zap" as const },
];

function getUpcomingDates() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    result.push({ label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}`, raw: d });
  }
  return result;
}

const DATES = getUpcomingDates();

export default function BookScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ service?: string }>();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(params.service || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const press = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const canNext = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedDate;
    if (step === 3) return !!selectedTime;
    if (step === 4) return !!name && !!phone && !!address;
    return true;
  };

  const handleNext = () => {
    if (!canNext()) {
      Alert.alert("Please make a selection", "Fill in the required field to continue.");
      return;
    }
    press();
    if (step < 5) setStep(step + 1);
  };

  const handleSendWhatsApp = () => {
    press();
    const msg = encodeURIComponent(
      `Hello Tahura Plumbing Contractors,\n\nI'd like to book a service:\n\n` +
      `📌 Service: ${selectedService}\n` +
      `📅 Date: ${selectedDate}\n` +
      `🕐 Time: ${selectedTime}\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📍 Address: ${address}` +
      (notes ? `\n📝 Notes: ${notes}` : "")
    );
    Linking.openURL(`https://wa.me/919867426238?text=${msg}`);
  };

  const handleCall = () => {
    press();
    Linking.openURL(`tel:${PHONE}`);
  };

  const STEPS = ["Service", "Date", "Time", "Details", "Confirm"];

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Book Appointment</Text>

        {/* Step Indicator */}
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: i + 1 <= step ? colors.gold : colors.surfaceHighlight,
                      borderColor: i + 1 === step ? colors.gold : "transparent",
                    },
                  ]}
                >
                  {i + 1 < step ? (
                    <Feather name="check" size={12} color={colors.primaryForeground} />
                  ) : (
                    <Text style={[styles.stepNum, { color: i + 1 <= step ? colors.primaryForeground : colors.mutedForeground }]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, { color: i + 1 === step ? colors.gold : colors.mutedForeground }]}>
                  {s}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: i + 1 < step ? colors.gold : colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 120 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Service */}
        {step === 1 && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Select Your Service</Text>
            <View style={styles.chipGrid}>
              {SERVICE_NAMES.map((svc) => (
                <Pressable
                  key={svc}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: selectedService === svc ? colors.gold : colors.card,
                      borderColor: selectedService === svc ? colors.gold : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => { press(); setSelectedService(svc); }}
                >
                  <Text style={[
                    styles.chipText,
                    { color: selectedService === svc ? colors.primaryForeground : colors.foreground },
                  ]}>
                    {svc}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Choose a Date</Text>
            <View style={styles.dateGrid}>
              {DATES.map((d) => (
                <Pressable
                  key={d.date}
                  style={({ pressed }) => [
                    styles.dateCard,
                    {
                      backgroundColor: selectedDate === d.date ? colors.gold : colors.card,
                      borderColor: selectedDate === d.date ? colors.gold : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => { press(); setSelectedDate(d.date); }}
                >
                  <Text style={[styles.dateDayLabel, { color: selectedDate === d.date ? colors.primaryForeground : colors.mutedForeground }]}>
                    {d.label}
                  </Text>
                  <Text style={[styles.dateDateNum, { color: selectedDate === d.date ? colors.primaryForeground : colors.foreground }]}>
                    {d.date}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Select Time Slot</Text>
            <View style={styles.timeList}>
              {TIME_SLOTS.map((t) => (
                <Pressable
                  key={t.id}
                  style={({ pressed }) => [
                    styles.timeCard,
                    {
                      backgroundColor: selectedTime === t.label ? colors.gold : colors.card,
                      borderColor: selectedTime === t.label ? colors.gold : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => { press(); setSelectedTime(t.label); }}
                >
                  <View style={[
                    styles.timeIconWrap,
                    { backgroundColor: selectedTime === t.label ? "rgba(0,0,0,0.2)" : colors.surfaceHighlight },
                  ]}>
                    <Feather name={t.icon} size={20} color={selectedTime === t.label ? colors.primaryForeground : colors.gold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.timeLabel, { color: selectedTime === t.label ? colors.primaryForeground : colors.foreground }]}>
                      {t.label}
                    </Text>
                    <Text style={[styles.timeRange, { color: selectedTime === t.label ? "rgba(0,0,0,0.6)" : colors.mutedForeground }]}>
                      {t.time}
                    </Text>
                  </View>
                  {selectedTime === t.label && (
                    <Feather name="check-circle" size={20} color={colors.primaryForeground} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Your Details</Text>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                placeholder="+91 9999999999"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Service Address *</Text>
              <TextInput
                style={[styles.input, styles.inputMulti, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                placeholder="House No, Street, Area, City"
                placeholderTextColor={colors.mutedForeground}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.inputMulti, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Describe your issue (optional)"
                placeholderTextColor={colors.mutedForeground}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Booking Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {[
                { label: "Service", value: selectedService },
                { label: "Date", value: selectedDate },
                { label: "Time", value: selectedTime },
                { label: "Name", value: name },
                { label: "Phone", value: phone },
                { label: "Address", value: address },
              ].map((row) => (
                <View key={row.label} style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{row.value}</Text>
                </View>
              ))}
              {notes ? (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Notes</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{notes}</Text>
                </View>
              ) : null}
            </View>

            <Pressable
              style={({ pressed }) => [styles.waBtn, { opacity: pressed ? 0.85 : 1 }]}
              onPress={handleSendWhatsApp}
            >
              <Feather name="message-circle" size={20} color="#fff" />
              <Text style={styles.waBtnText}>Send via WhatsApp</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.callBtn,
                { borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleCall}
            >
              <Feather name="phone" size={18} color={colors.foreground} />
              <Text style={[styles.callBtnText, { color: colors.foreground }]}>Call Instead</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav Buttons */}
      {step < 5 && (
        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 12),
            },
          ]}
        >
          {step > 1 && (
            <Pressable
              style={({ pressed }) => [
                styles.backBtn,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => { press(); setStep(step - 1); }}
            >
              <Feather name="arrow-left" size={18} color={colors.foreground} />
              <Text style={[styles.backBtnText, { color: colors.foreground }]}>Back</Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: colors.gold, opacity: pressed ? 0.85 : 1, flex: step === 1 ? 1 : undefined },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>
              {step === 4 ? "Review" : "Next"}
            </Text>
            <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 16 },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  stepNum: { fontSize: 11, fontFamily: "Inter_700Bold" },
  stepLabel: { fontSize: 9, fontFamily: "Inter_500Medium", marginTop: 4 },
  stepLine: { flex: 1, height: 2, marginBottom: 14, marginHorizontal: 4 },
  body: { padding: 20 },
  stepTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 20 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  dateGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dateCard: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateDayLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  dateDateNum: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 4 },
  timeList: { gap: 12 },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  timeIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  timeLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  timeRange: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  inputMulti: { height: 80, textAlignVertical: "top" },
  summaryCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden", marginBottom: 24 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  summaryLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1, textAlign: "right" },
  waBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#25D366",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  waBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  callBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  bottomNav: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  nextBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
