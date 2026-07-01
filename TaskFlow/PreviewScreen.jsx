import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.retakeButton]}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Result', { photoUri })}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: '#6b7280',
  },
  analyzeButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
