import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch pokemons
    fetchPokemons()
  }, [])

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=1350"
      );
      const data = await response.json();

      setPokemons([]);

      for (const pokemon of data.results) {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        const newPokemon = {
          id: details.id,
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`,
          types: details.types,
        };

        // Add one Pokémon at a time
        setPokemons((prev) => [...prev, newPokemon]);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: 16,
          }}
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
                />
                <Text style={styles.name}>{pokemon.name}</Text>
                <Text style={styles.id}>
                  {String(pokemon.id).padStart(5, "0")}
                </Text>
              </View>
            </Link>
          )}
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
