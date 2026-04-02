export async function fetchPokemonList(offset = 0, limit = 50) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();

        const results = await Promise.all(
            data.results.map(async (pokemon: any) => {
                try {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();

                    return {
                        id: details.id,
                        name: pokemon.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`,
                        types: details.types,
                    };
                } catch {
                    return null; // Skip failed ones
                }
            })
        );

        // Remove failed ones
        return results.filter(Boolean);
    } catch (error) {
        console.log("API error:", error);
        throw error;
    }
}