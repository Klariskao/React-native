import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
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
        "https://pokeapi.co/api/v2/ability/?limit=20"
      );
      const data = await response.json();

      setPokemons(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
        </View >
      ))}
    </ScrollView >
  );
}
