
import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const Screen2 = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [labels, setLabels] = useState([]);

  const handleImageUpload = async () => {
    const apiKey = '<YOUR_API_KEY_HERE>';
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const base64Image = await imageToBase64(imageUrl);
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
            },
          ],
        },
      ],
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(endpoint, requestBody, config);
    const data = response.data;
    const labels = data.responses[0].labelAnnotations.map(label => label.description);

    setLabels(labels);
  };

  const imageToBase64 = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    return base64;
  };

  const blobToBase64 = blob =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  const handleImageSelect = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        setImageUrl(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      ) : (
        <Button title="Select Image" onPress={handleImageSelect} />
      )}
      <Button title="Detect Labels" onPress={handleImageUpload} />
      {labels.map(label => (
        <Text key={label}>{label}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Screen2;
