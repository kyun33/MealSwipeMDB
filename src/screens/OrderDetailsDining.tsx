import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderDetailsDining = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Details - Dining</Text>
            {/* Additional order details can be displayed here */}
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

export default OrderDetailsDining;