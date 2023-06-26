import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import BusinessListItem from './BusinessListItem';
import BusinessModal from './BusinessModal';

const MapView = ({ businesses, mapCenter, handleItemClick }) => {
  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const mapOptions = {
    disableDefaultUI: true,
  };

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [map, setMap] = useState(null);

  const handleMarkerClick = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);

    if (map) {
      const markerPosition = {
        lat: parseFloat(business.coordinates.latitude),
        lng: parseFloat(business.coordinates.longitude),
      };
      map.panTo(markerPosition);
    }
  };

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleCloseModal = () => {
    setSelectedBusiness(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={mapCenter}
        options={mapOptions}
        onLoad={handleMapLoad}>
        {businesses.map((business) => (
          <Marker
            key={business.id}
            position={{
              lat: parseFloat(business.coordinates.latitude),
              lng: parseFloat(business.coordinates.longitude),
            }}
            onClick={() => handleMarkerClick(business)}
          />
        ))}
      </GoogleMap>

      {isModalOpen && (
        <BusinessModal onClose={handleCloseModal}>
          <BusinessListItem
            business={selectedBusiness}
            handleItemClick={() => handleItemClick(selectedBusiness)}
          />
          <button onClick={() => handleItemClick(selectedBusiness)}>
            View Details
          </button>
        </BusinessModal>
      )}
    </div>
  );
};

export default MapView;
