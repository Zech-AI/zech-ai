import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedImage(reader.result);
        makePrediction(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const makePrediction = async (imageData) => {
    const API_KEY = 'YOUR_API_KEY';
    const ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;

    const requestData = {
      requests: [
        {
          image: {
            content: imageData.split(',')[1]
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 5
            }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(ENDPOINT_URL, requestData);
      const labels = response.data.responses[0].labelAnnotations.map(label => label.description);
      setPrediction(labels.join(', '));
    } catch (error) {
      console.log('Error making prediction:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '300px' }} />}
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
};

export default ImageUploader;
