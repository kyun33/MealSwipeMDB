import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Screen } from '../App';

interface IDVerificationScreenProps {
  onComplete: () => void;
}

export function IDVerificationScreen({ onComplete }: IDVerificationScreenProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to upload your ID');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!uploadedImage) {
      Alert.alert('No image', 'Please upload your ID image first');
      return;
    }
    onComplete();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Verify Your Identity</Text>
          <Text style={styles.headerSubtitle}>
            Upload your Cal 1 Card or student ID to verify you're a Berkeley student
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!uploadedImage ? (
          <TouchableOpacity
            onPress={pickImage}
            style={styles.uploadArea}
          >
            <MaterialCommunityIcons name="cloud-upload-outline" size={48} color="#003262" />
            <Text style={styles.uploadText}>Tap to upload your ID</Text>
            <Text style={styles.uploadSubtext}>JPG, PNG up to 5MB</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} />
            <TouchableOpacity
              onPress={pickImage}
              style={styles.changeButton}
            >
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#003262" />
          <Text style={styles.infoText}>
            Your ID will be verified within 24 hours. You can start using the app once verified.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton, !uploadedImage && styles.submitButtonDisabled]}
          disabled={!uploadedImage}
        >
          <Text style={styles.submitButtonText}>Submit for Verification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#003262',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#003262',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003262',
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  imageContainer: {
    marginBottom: 24,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  changeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#003262',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003262',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#003262',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
