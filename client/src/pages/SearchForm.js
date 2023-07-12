import React, { useState } from 'react';
import './SearchForm.css';
import { BsSearch } from 'react-icons/bs';
import { BsArrowRightCircle } from 'react-icons/bs';

const SearchForm = ({
  searchAddress,
  setSearchAddress,
  handleSearch,
  submitted,
  apiKey,
}) => {
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const [showUseCurrentLocation, setShowUseCurrentLocation] = useState(false);

  const handleUseCurrentLocation = () => {
    setShowUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.status === 'OK') {
              const address = data.results[0].formatted_address;
              setSearchAddress(address);
            } else {
              setCurrentLocationError('Unable to retrieve your location.');
            }
          } catch (error) {
            setCurrentLocationError(
              'An error occurred while fetching your location.'
            );
            console.error(error);
          }
        },
        (error) => {
          setCurrentLocationError('Unable to retrieve your location.');
          console.error(error);
        }
      );
    } else {
      setCurrentLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleInputFocus = () => {
    setShowUseCurrentLocation(true);
  };

  return (
    <div className={`search-form ${submitted ? 'submitted' : ''}`}>
      <form
        className={`form-container ${submitted ? 'submitted' : ''}`}
        onSubmit={handleSearch}>
        <div className="form-container-inner">
          <div className="search-icon-container">
            <BsSearch className="search-icon" />
          </div>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            name="search"
            placeholder="Enter Location"
            onFocus={handleInputFocus}
          />
          <button type="submit" className="submit-btn">
            <BsArrowRightCircle className="submit-icon" />
          </button>
        </div>
      </form>
      {showUseCurrentLocation && (
        <button
          className="current-location-btn"
          onClick={handleUseCurrentLocation}>
          Use Current Location
        </button>
      )}
      {currentLocationError && <p>{currentLocationError}</p>}
    </div>
  );
};

export default SearchForm;
