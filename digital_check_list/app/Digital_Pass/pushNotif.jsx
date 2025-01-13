import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Camera access is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }
   
    const formData = new FormData();
    // Extract the original file name or use a fallback
    const fileName = image.split('/').pop() || `image_${Date.now()}.jpg`;
   
    formData.append('file', {
      uri: image,
      name: fileName, // Dynamic or original file name
      type: 'image/jpeg', // Adjust MIME type based on your file
    });
   
    try {
      const response = await fetch('http://10.10.9.89:203/api/Upload/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
   
      if (response.ok) {
        Alert.alert('Upload Successful', 'The image has been uploaded.');
        console.log('Image uploaded successfully.');
        console.log(await response.json()); // Log response for debugging
      } else {
        const errorResponse = await response.json();
        Alert.alert('Upload Failed', errorResponse.message || 'Failed to upload the image.');
        console.error('Upload failed:', response.status, errorResponse);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Button title="Open Camera" onPress={pickFromCamera} />
      <Button title="Pick an image from gallery" onPress={pickFromLibrary} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
