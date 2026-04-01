import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image } from "react-native";

interface Pokemon {
  name: string;
  image: string;
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
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
          };
        })
      );

      setPokemons(pokemonDetails);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
          <Image
            source={{ uri: pokemon.image }}
            style={{ width: 100, height: 100 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
