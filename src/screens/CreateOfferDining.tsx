import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateOfferDining = () => {
    const [offerDetails, setOfferDetails] = useState('');
    const [price, setPrice] = useState('');

    const handleCreateOffer = () => {
        // Logic to create a dining offer
        console.log('Offer Created:', { offerDetails, price });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Dining Offer</Text>
            <TextInput
                style={styles.input}
                placeholder="Offer Details"
                value={offerDetails}
                onChangeText={setOfferDetails}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <Button title="Create Offer" onPress={handleCreateOffer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default CreateOfferDining;