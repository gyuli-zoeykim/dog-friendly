import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoadScript } from '@react-google-maps/api';
import App from './App';

const fetchAPIKey = async () => {
  try {
    const response = await fetch('/api/key');
    if (!response.ok) {
      throw new Error('Failed to retrieve API key');
    }
    const data = await response.json();
    console.log('data', data);
    return data.apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <LoadScript googleMapsApiKey={fetchAPIKey}>
    <App />
  </LoadScript>
);
