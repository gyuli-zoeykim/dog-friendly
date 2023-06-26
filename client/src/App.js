import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import BusinessList from './components/BusinessList';
import MapView from './components/MapView';
import BusinessDetail from './components/BusinessDetail';

const App = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [openBusinesses, setOpenBusinesses] = useState([]);
  const [viewType, setViewType] = useState('list');
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [searchFormSubmitted, setSearchFormSubmitted] = useState(false);

  useEffect(() => {
    if (allBusinesses.length > 0 && !mapCenter) {
      const { latitude, longitude } = allBusinesses[0].coordinates;
      setMapCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    }
  }, [allBusinesses, mapCenter]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchFormSubmitted(true);

    try {
      const allResponse = await fetch(
        `/api/businesses?address=${encodeURIComponent(searchAddress)}`
      );
      const openResponse = await fetch(
        `/api/businesses/open?address=${encodeURIComponent(searchAddress)}`
      );

      const allData = await allResponse.json();
      const openData = await openResponse.json();
      console.log('alldata', allData);
      setAllBusinesses(allData);
      setOpenBusinesses(openData);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleGetDirectionsClick = (business) => {
    const { latitude, longitude } = business.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        searchAddress
      )}&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  const handleItemClick = async (business) => {
    try {
      const response = await fetch(`/api/businesses/${business.id}`);
      const data = await response.json();
      console.log('data', data);
      setSelectedBusiness(data);
      setShowButtons(false);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleOpenOnlyClick = () => {
    setShowOpenOnly(!showOpenOnly);
  };

  const handleBackToListClick = () => {
    setSelectedBusiness(null);
    setShowButtons(true);
  };

  const filteredBusinesses = showOpenOnly ? openBusinesses : allBusinesses;

  return (
    <div>
      <SearchForm
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        handleSearch={handleSearch}
      />

      {showButtons && (
        <div>
          <button onClick={handleOpenOnlyClick}>
            {showOpenOnly ? 'All Businesses' : 'Open Only'}
          </button>
          <button onClick={() => setViewType('list')}>List View</button>
          <button onClick={() => setViewType('map')}>Map View</button>
        </div>
      )}

      {viewType === 'list' && !selectedBusiness && searchFormSubmitted && (
        <>
          {filteredBusinesses === openBusinesses &&
          !filteredBusinesses.length ? (
            <h1>No businesses are open</h1>
          ) : (
            <BusinessList
              businesses={filteredBusinesses}
              handleItemClick={handleItemClick}
            />
          )}
        </>
      )}

      {viewType === 'map' && !selectedBusiness && searchFormSubmitted && (
        <>
          {filteredBusinesses === openBusinesses &&
          !filteredBusinesses.length ? (
            <h1>No businesses are open</h1>
          ) : (
            <MapView
              businesses={filteredBusinesses}
              mapCenter={mapCenter}
              handleItemClick={handleItemClick}
            />
          )}
        </>
      )}

      {selectedBusiness && (
        <div>
          <button onClick={handleBackToListClick}>Back to List</button>
          <BusinessDetail
            business={selectedBusiness}
            handleGetDirectionsClick={handleGetDirectionsClick}
          />
        </div>
      )}
    </div>
  );
};

export default App;
