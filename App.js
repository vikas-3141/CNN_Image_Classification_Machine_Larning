import React, { useState } from 'react';
import axios from 'axios';
import'./App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState('');

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      alert("Please upload a file");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      
    } catch (error) {
      console.error('There was an error uploading the file!', error);
      alert('Error uploading the image');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }} className="container">
      <h2>Dog or Cat Classifier</h2>
      
      <input type="file" onChange={onFileChange} className="file-input"/>
      <button onClick={onFileUpload} className="upload-button">Classify Image</button>

      {prediction && (
        <div className="result">
          <h3>Prediction: {prediction}</h3>
          <h4>Confidence: {confidence}%</h4>
        </div>
      )}
    </div>
  );
};

export default App;
