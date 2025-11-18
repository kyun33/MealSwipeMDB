import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateOfferGrubhub = () => {
    const [offerDetails, setOfferDetails] = React.useState('');

    const handleCreateOffer = () => {
        // Logic to create a Grubhub offer
        console.log('Offer created:', offerDetails);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Grubhub Offer</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter offer details"
                value={offerDetails}
                onChangeText={setOfferDetails}
            />
            <Button title="Create Offer" onPress={handleCreateOffer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default CreateOfferGrubhub;