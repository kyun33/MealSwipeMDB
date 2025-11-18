import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../components/common/Avatar';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Avatar size={100} />
            <Text style={styles.username}>Username</Text>
            <Text style={styles.email}>user@example.com</Text>
            <Text style={styles.bio}>This is a short bio about the user.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    email: {
        fontSize: 16,
        color: 'gray',
    },
    bio: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default ProfileScreen;