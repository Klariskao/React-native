import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import '../src/utils/extensions';
import PokemonCardContainer from "../src/components/pokemon-card-container";

interface PokemonType {
    type: {
        name: string;
    };
}

interface PokemonAbility {
    ability: {
        name: string;
    };
}

interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    };
}

interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    sprites: any;
}

const tabs = ["Details", "Types", "Stats", "Abilities"];

export default function PokemonDetails() {
    const params = useLocalSearchParams();
    const { name } = params as { name: string };
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [activeTab, setActiveTab] = useState("Details");

    useEffect(() => {
        fetchPokemonDetails(name);
    }, [name]);

    async function fetchPokemonDetails(name: string) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            const data = await res.json();
            setPokemon(data);
        } catch (error) {
            console.log(error);
        }
    }

    if (!pokemon) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Format ID like 00001
    const formattedId = String(pokemon.id).padStart(5, "0");
    const primaryType = pokemon.types[0].type.name;

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            {/* Header: Name + ID */}
            <View style={{ alignItems: "center" }}>
                <Text style={styles.name}>{pokemon.name.capitalizeWords()}</Text>
                <Text style={styles.id}>{formattedId}</Text>
            </View>

            {/* Big official front image artwork */}
            <PokemonCardContainer type={primaryType} style={{ padding: 24 }}>
                <Image
                    source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                />
            </PokemonCardContainer>

            {/* Original sprites */}
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
                <PokemonCardContainer type={primaryType} style={{ padding: 12 }}>
                    <Image
                        source={{ uri: pokemon.sprites.front_default }}
                        style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                    />
                </PokemonCardContainer>
                <PokemonCardContainer type={primaryType} style={{ padding: 12 }}>
                    <Image
                        source={{ uri: pokemon.sprites.back_default }}
                        style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                    />
                </PokemonCardContainer>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText,
                        ]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab content */}
            <View>
                {activeTab === "Details" && (
                    <View>
                        <Text style={{ fontSize: 16 }}>Height: {pokemon.height / 10} m</Text>
                        <Text style={{ fontSize: 16 }}>Weight: {pokemon.weight / 10} kg</Text>
                    </View>
                )}

                {activeTab === "Types" && (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        {pokemon.types.map((t) => (
                            <View
                                key={t.type.name}
                                style={{
                                    backgroundColor: "#EEE",
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 12,
                                }}
                            >
                                <Text>{t.type.name}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "Stats" && (
                    <View>
                        {pokemon.stats.map((s) => (
                            <View key={s.stat.name} style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 4 }}>
                                <Text>{s.stat.name}</Text>
                                <Text>{s.base_stat}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "Abilities" && (
                    <View>
                        {pokemon.abilities.map((a) => (
                            <Text key={a.ability.name}>{a.ability.name}</Text>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
    },
    id: {
        fontSize: 18,
        color: "gray",
        marginTop: 4,
    },
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderBottomColor: "#CCC",
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    tabText: {
        fontSize: 16,
        color: "#555",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#333",
    },
    activeTabText: {
        fontWeight: "bold",
        color: "#000",
    },
});