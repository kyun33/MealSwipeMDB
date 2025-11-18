import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SellHubScreen = () => {
    const handleCreateOffer = () => {
        // Logic to create a new selling offer
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sell Hub</Text>
            <Button title="Create Offer" onPress={handleCreateOffer} />
            {/* Additional UI components and logic for managing selling offers can be added here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default SellHubScreen;