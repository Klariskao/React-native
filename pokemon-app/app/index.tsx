import { Link } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { FlatList, Text, View, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchPokemonList } from "../src/api/pokemon";
import '../src/utils/extensions';
import React from "react";

interface Pokemon {
  id: string,
  name: string;
  image: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  }
}

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
}

const MAX_POKEMONS = 1350;

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const offsetRef = useRef(0);

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const data = await fetchPokemonList(0, 50);
      setPokemons(data);
      offsetRef.current = 50;
    } catch (error) {
      console.log("UI error initial load:", error);
      // TODO show error state to user
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextOffset = offsetRef.current;

      if (nextOffset >= MAX_POKEMONS) {
        setHasMore(false);
        return;
      }

      console.log("Fetching offset:", nextOffset);
      const data = await fetchPokemonList(nextOffset, 50);

      setPokemons((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newOnes];
      });
      offsetRef.current += 50;
      if (offsetRef.current >= MAX_POKEMONS) setHasMore(false);
    } catch (error) {
      console.log("UI error loading more:", error);
      // TODO show error state to user
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredPokemons = pokemons.filter((pokemon) => {
    const query = search.toLowerCase();

    return (
      pokemon.name.toLowerCase().includes(query) ||
      String(pokemon.id).includes(query)
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.header}>
          Search for a Pokémon by name or using its National Pokédex number.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />

        <TextInput
          placeholder="Search by name or number..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading && pokemons.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => item.name}
          numColumns={2}
          initialNumToRender={4}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: 16,
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
          renderItem={({ item: pokemon }) => (
            <Link
              href={{
                pathname: "/pokemon-details",
                params: { name: pokemon.name }
              }}
              style={{
                flex: 1,
                // @ts-ignore
                backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
                padding: 20,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
                <Text style={styles.name}>{pokemon.name.capitalizeWords()}</Text>
                <Text style={styles.id}>
                  {String(pokemon.id).padStart(5, "0")}
                </Text>
              </View>
            </Link>
          )}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 24,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1d1d1",
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
    fontSize: 16,
  },
  name: {
    fontSize: 20,
    color: '#292663',
    fontWeight: "bold",
    textAlign: "center",
  },
  id: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  }
})
