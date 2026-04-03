import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { colorsByType } from "../constants/colors";

interface Props {
  type: string;
  children: ReactNode;
  style?: any;
}

export default function PokemonCardContainer({ type, children, style }: Props) {
  const typeName = type as keyof typeof colorsByType;
  const bgColor = colorsByType[typeName] || "#fff";

  return (
    <View style={[styles.card, { backgroundColor: bgColor + "33" }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});