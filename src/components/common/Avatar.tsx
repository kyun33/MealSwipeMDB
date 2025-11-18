import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
  uri: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 50 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={{ uri }} style={[styles.image, { width: size, height: size }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  image: {
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

export default Avatar;