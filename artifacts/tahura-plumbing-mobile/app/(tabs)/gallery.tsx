import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { GALLERY_IMAGES } from "@/constants/content";

const { width } = Dimensions.get("window");
const IMG_SIZE = (width - 48) / 2;

export default function GalleryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLightboxIndex(index);
  };

  const closeImage = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null && lightboxIndex < GALLERY_IMAGES.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Our Work</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {GALLERY_IMAGES.length} photos · Tap to view
        </Text>
      </View>

      <FlatList
        data={GALLERY_IMAGES}
        numColumns={2}
        keyExtractor={(_, i) => String(i)}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!GALLERY_IMAGES.length}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => [styles.imgWrap, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => openImage(index)}
          >
            <Image source={item} style={styles.img} resizeMode="cover" />
            <View style={styles.imgOverlay}>
              <Feather name="maximize-2" size={16} color="#fff" />
            </View>
          </Pressable>
        )}
      />

      {/* Lightbox Modal */}
      <Modal visible={lightboxIndex !== null} transparent animationType="fade">
        <View style={styles.modalBg}>
          <Pressable style={styles.modalClose} onPress={closeImage}>
            <Feather name="x" size={24} color="#fff" />
          </Pressable>

          {lightboxIndex !== null && (
            <Image
              source={GALLERY_IMAGES[lightboxIndex]}
              style={styles.modalImg}
              resizeMode="contain"
            />
          )}

          <View style={styles.modalControls}>
            <Pressable
              style={({ pressed }) => [styles.navBtn, { opacity: lightboxIndex === 0 ? 0.3 : pressed ? 0.7 : 1 }]}
              onPress={goPrev}
              disabled={lightboxIndex === 0}
            >
              <Feather name="chevron-left" size={28} color="#fff" />
            </Pressable>

            <Text style={styles.modalCounter}>
              {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {GALLERY_IMAGES.length}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.navBtn,
                { opacity: lightboxIndex === GALLERY_IMAGES.length - 1 ? 0.3 : pressed ? 0.7 : 1 },
              ]}
              onPress={goNext}
              disabled={lightboxIndex === GALLERY_IMAGES.length - 1}
            >
              <Feather name="chevron-right" size={28} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>
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
  grid: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  imgWrap: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  img: { width: "100%", height: "100%" },
  imgOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalClose: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modalImg: { width: width - 32, height: width - 32, borderRadius: 12 },
  modalControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 24,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCounter: { color: "#fff", fontSize: 16, fontFamily: "Inter_500Medium" },
});
