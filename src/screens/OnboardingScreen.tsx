import React from 'react';
import { View, Text, Button } from 'react-native';

const OnboardingScreen = ({ navigation }) => {
    const handleNext = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to MealSwipe!</Text>
            <Text>Let's get you started.</Text>
            <Button title="Next" onPress={handleNext} />
        </View>
    );
};

export default OnboardingScreen;