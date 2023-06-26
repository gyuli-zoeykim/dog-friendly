import React from 'react';

const BusinessListItem = ({ business, handleItemClick }) => {
  const { name, rating, review_count, location, image_url } = business;

  return (
    <li>
      <div>
        <img src={image_url} alt={name} width="50" height="50" />
      </div>
      <div onClick={() => handleItemClick(business)}>
        <h3>{name}</h3>
        <p>
          Rating: {rating} ({review_count} reviews)
        </p>
        <p>
          {location.address1}, {location.city}, {location.state}{' '}
          {location.zip_code}
        </p>
      </div>
    </li>
  );
};

export default BusinessListItem;
