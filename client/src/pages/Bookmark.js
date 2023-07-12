// import React from 'react';
// import BusinessList from './BusinessList';

// const Bookmark = ({
//   bookmarkList,
//   businesses,
//   setShowOpenOnly,
//   showOpenOnly,
//   setViewType,
//   viewType,
//   openBusinesses,
//   handleItemClick,
//   saveBookmark,
//   deleteBookmark,
//   bookmark,
//   formatNumber,
//   apiKey,
//   mapCenter
//  }) => {
//   return (
//     <div>
//       <h2>Bookmarked Lists</h2>
//       {bookmarkList.length === 0 ? (
//        <div>Bookmark not found</div> ):(
//         <BusinessList
//           businesses={bookmarkList}
//           useCustomMarker={true}
//           setShowOpenOnly={setShowOpenOnly}
//           showOpenOnly={showOpenOnly}
//           setViewType={setViewType}
//           viewType={viewType}
//           openBusinesses={openBusinesses}
//           handleItemClick={handleItemClick}
//           saveBookmark={saveBookmark}
//           deleteBookmark={deleteBookmark}
//           bookmark={bookmark}
//           formatNumber={formatNumber}
//           apiKey={apiKey}
//           mapCenter={mapCenter}
//         />
//        )
//       }
//     </div>
//   );
// };
// export default Bookmark;

import React from 'react';
import BusinessList from './BusinessList';

const Bookmark = ({
  bookmarkList,
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
    <div>
      <h2>Bookmarked Lists</h2>
      <BusinessList
        businesses={bookmarkList}
        useCustomMarker={true}
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
  );
};
export default Bookmark;
