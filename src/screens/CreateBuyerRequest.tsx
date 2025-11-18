import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateBuyerRequest = () => {
    const [requestDetails, setRequestDetails] = useState('');

    const handleSubmit = () => {
        // Logic to handle the submission of the buyer request
        console.log('Buyer request submitted:', requestDetails);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Buyer Request</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter request details"
                value={requestDetails}
                onChangeText={setRequestDetails}
            />
            <Button title="Submit Request" onPress={handleSubmit} />
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

export default CreateBuyerRequest;