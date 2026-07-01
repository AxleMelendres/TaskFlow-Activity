import React, { useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    console.log(photo);
  };

  if (permission === null) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          activeOpacity={0.8}
          onPress={takePicture}>
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  captureButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 48,
    left: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#d9d9d9',
  },
  captureButtonText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
});
