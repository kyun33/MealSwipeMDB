import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const IDVerificationScreen = () => {
    const [idNumber, setIdNumber] = React.useState('');
    const [error, setError] = React.useState('');

    const handleVerify = () => {
        // Add verification logic here
        if (idNumber.trim() === '') {
            setError('ID number is required');
        } else {
            setError('');
            // Proceed with verification
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ID Verification</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your ID number"
                value={idNumber}
                onChangeText={setIdNumber}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Verify ID" onPress={handleVerify} />
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
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default IDVerificationScreen;