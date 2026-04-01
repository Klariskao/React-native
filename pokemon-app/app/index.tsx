import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet, Pressable } from "react-native";

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
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    // Fetch pokemons
    fetchPokemons()
  }, [])

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20"
      );
      const data = await response.json();

      // Fetch details about each pokemon in parallel
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`

          return {
            id: details.id,
            name: pokemon.name,
            image: image,
            types: details.types,
          };
        })
      );

      setPokemons(pokemonDetails);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{
            pathname: "/pokemon-details",
            params: { name: pokemon.name }
          }}
          style={{
            width: "46%",
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
            <Text style={styles.id}>{String(pokemon.id).padStart(3, "0")}</Text>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    color: '#292663',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  id: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
  }
})
