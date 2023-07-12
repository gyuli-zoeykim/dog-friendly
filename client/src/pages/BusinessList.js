import './BusinessList.css';
import BusinessListItem from '../components/BusinessListItem';
import MapView from '../components/MapView';
import { LoadScript } from '@react-google-maps/api';

const BusinessList = ({
  businesses,
  setShowOpenOnly,
  showOpenOnly,
  setViewType,
  viewType,
  openBusinesses,
  handleItemClick,
  saveBookmark,
  deleteBookmark,
  bookmark,
  formatNumber,
  apiKey,
  mapCenter,
}) => {
  return (
    <div className="search-result-container">
      <div className="filter-container">
        <button
          className={`filter ${showOpenOnly ? 'all' : 'open'}`}
          onClick={() => setShowOpenOnly(!showOpenOnly)}>
          {showOpenOnly ? 'All Businesses' : 'Currently Open'}
        </button>
        <div className="view-type-container">
          <button
            className={`view ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => setViewType('list')}>
            List
          </button>
          <button
            className={`view ${viewType === 'map' ? 'active' : ''}`}
            onClick={() => setViewType('map')}>
            Map
          </button>
        </div>
      </div>
      {viewType === 'list' && (
        <>
          {businesses === openBusinesses && !businesses.length ? (
            <h1>No businesses are open</h1>
          ) : null}
          <ul>
            {businesses.map((business) => {
              const matchingBusiness = openBusinesses.find(
                (openBusiness) => openBusiness.id === business.id
              );
              const openStatus = matchingBusiness ? true : false;

              return (
                <BusinessListItem
                  key={business.id}
                  business={business}
                  handleItemClick={handleItemClick}
                  openStatus={openStatus}
                  saveBookmark={saveBookmark}
                  deleteBookmark={deleteBookmark}
                  bookmark={bookmark}
                  formatNumber={formatNumber}
                />
              );
            })}
          </ul>
        </>
      )}
      {viewType === 'map' && (
        <div className="map-view-container">
          <LoadScript googleMapsApiKey={apiKey}>
            <MapView
              businesses={businesses}
              mapCenter={mapCenter}
              handleItemClick={handleItemClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          </LoadScript>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
