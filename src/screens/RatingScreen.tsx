import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RatingScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rate Your Experience</Text>
            {/* Add your rating components here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default RatingScreen;