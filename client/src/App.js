import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SearchForm from './pages/SearchForm';
import BusinessDetail from './pages/BusinessDetail';
import Bookmark from './pages/Bookmark';
import Header from './components/Header';
import LocationNotFound from './pages/LocationNotFound';
import BusinessList from './pages/BusinessList';
import Profile from './pages/Profile';

const App = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [openBusinesses, setOpenBusinesses] = useState([]);
  const [viewType, setViewType] = useState('list');
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [bookmark, setBookmark] = useState([]);
  const [bookmarkList, setBookmarkList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/key')
      .then((response) => response.json())
      .then((data) => {
        setApiKey(data.apiKey);
      })
      .catch((error) => {
        console.error('Failed to fetch environment variables:', error);
      });
  }, []);

  useEffect(() => {
    if (
      (allBusinesses.length > 0 ||
        openBusinesses.length > 0 ||
        bookmarkList.length > 0) &&
      !mapCenter
    ) {
      const firstBusiness =
        allBusinesses[0] || openBusinesses[0] || bookmarkList[0];
      const { latitude, longitude } = firstBusiness.coordinates;
      setMapCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    }
  }, [allBusinesses, openBusinesses, mapCenter, bookmarkList]);

  const allBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to save bookmark');
      }
      const bookmarkData = await response.json();
      console.log(bookmarkData);
      setBookmark(bookmarkData);
    } catch (error) {
      console.error('Error bookmark:', error);
    }
  };

  useEffect(() => {
    allBookmark();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const allResponse = await fetch(
        `/api/businesses?address=${encodeURIComponent(searchAddress)}`
      );
      const openResponse = await fetch(
        `/api/businesses/open?address=${encodeURIComponent(searchAddress)}`
      );

      if (!allResponse.ok || !openResponse.ok) {
        throw new Error('Error fetching data');
      }
      const allData = await allResponse.json();
      const openData = await openResponse.json();
      console.log('alldata', allData);
      setAllBusinesses(allData);
      setOpenBusinesses(openData);
      navigate('/search-results');
    } catch (error) {
      console.log('Error:', error);
      navigate('/location-not-found');
    }
  };

  const saveBookmark = async (placeId) => {
    const data = { placeId };

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save bookmark');
      }
      const bookmark = await response.json();
      console.log('Bookmark saved:', bookmark);
      alert('Bookmark saved successfully!');
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('Failed to save bookmark. Please try again.');
    }
    allBookmark();
  };

  const deleteBookmark = async (placeId) => {
    const data = { placeId };

    try {
      const response = await fetch(`/api/bookmarks/${placeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }
      const bookmark = await response.json();
      console.log('Bookmark deleted:', bookmark);
      alert('Bookmark deleted successfully!');
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('Failed to delete bookmark. Please try again.');
    }
    allBookmark();
  };

  useEffect(() => {
    const loadBookmarkList = async () => {
      try {
        const fetchPromises = bookmark.map(async (businessId) => {
          const response = await fetch(`/api/businesses/${businessId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch business details');
          }
          const data = await response.json();
          return data;
        });

        const results = await Promise.all(fetchPromises);
        const filteredResults = results.filter((business) => !business.error);
        console.log('BookmarkedData:', filteredResults);
        setBookmarkList(filteredResults);
      } catch (error) {
        console.error('Error fetching business details:', error);
      }
    };

    loadBookmarkList();
  }, [bookmark]);

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
      if (location.pathname.includes('/search-results')) {
        navigate(`/search-results/${business.id}`);
      } else if (location.pathname.includes('/bookmark')) {
        navigate(`/bookmark/${business.id}`);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const formatNumber = (number) => {
    if (number >= 1000) {
      const rounded = Math.round((number / 1000) * 10) / 10;
      return `${rounded}K`;
    }
    return number.toString();
  };

  const filterBusinesses = showOpenOnly ? openBusinesses : allBusinesses;
  const open = bookmarkList.filter((business) => business.hours[0].is_open_now);

  const filteredBookmarkList = showOpenOnly ? open : bookmarkList;

  const isBusinessDetailPage = location.pathname.includes('/search-results/');

  return (
    <>
      {!isBusinessDetailPage && <Header />}
      <Routes>
        <Route
          path="*"
          element={
            <SearchForm
              searchAddress={searchAddress}
              setSearchAddress={setSearchAddress}
              handleSearch={handleSearch}
              apiKey={apiKey}
            />
          }
        />
        <Route
          path="/bookmark"
          element={
            <Bookmark
              bookmarkList={filteredBookmarkList}
              businesses={filterBusinesses}
              setShowOpenOnly={setShowOpenOnly}
              showOpenOnly={showOpenOnly}
              setViewType={setViewType}
              viewType={viewType}
              openBusinesses={open}
              handleItemClick={handleItemClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
              apiKey={apiKey}
              mapCenter={mapCenter}
            />
          }
        />
        <Route path="/location-not-found" element={<LocationNotFound />} />
        <Route
          path="/search-results"
          element={
            <div className="search-result-page">
              <SearchForm
                searchAddress={searchAddress}
                setSearchAddress={setSearchAddress}
                handleSearch={handleSearch}
                submitted={submitted}
                apiKey={apiKey}
              />
              <BusinessList
                businesses={filterBusinesses}
                setShowOpenOnly={setShowOpenOnly}
                showOpenOnly={showOpenOnly}
                setViewType={setViewType}
                viewType={viewType}
                openBusinesses={openBusinesses}
                handleItemClick={handleItemClick}
                saveBookmark={saveBookmark}
                deleteBookmark={deleteBookmark}
                bookmark={bookmark}
                formatNumber={formatNumber}
                apiKey={apiKey}
                mapCenter={mapCenter}
              />
            </div>
          }
        />
        <Route
          path="/search-results/:id"
          element={
            <BusinessDetail
              business={selectedBusiness}
              handleGetDirectionsClick={handleGetDirectionsClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          }
        />
        <Route
          path="/bookmark/:id"
          element={
            <BusinessDetail
              business={selectedBusiness}
              handleGetDirectionsClick={handleGetDirectionsClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
