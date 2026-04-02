import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

const colorsByType = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

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