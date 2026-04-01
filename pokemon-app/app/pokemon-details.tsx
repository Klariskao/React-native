import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function PokemonDetails() {
    const params = useLocalSearchParams()

    useEffect(() => { }, []);

    async function fetchPokemonDetails(name: string) {
        try {
            // TODO fetch the details
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                gap: 16,
                padding: 16,
            }}
        >

        </ScrollView>
    );
}

const styles = StyleSheet.create({})
