import React, { useState } from 'react';
import './BusinessListItem.css';
import { BsFillHeartFill } from 'react-icons/bs';
import { BsStarFill } from 'react-icons/bs';

const BusinessListItem = ({
  business,
  handleItemClick,
  bookmark,
  saveBookmark,
  deleteBookmark,
  openStatus,
  formatNumber,
}) => {
  const { id, name, rating, review_count, location, image_url } = business;
  const foundId = bookmark.find((number) => number === id);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmDelete = () => {
    deleteBookmark(id);
    closeModal();
  };

  return (
    <li className="search-result-list">
      <div className="img-bookmark">
        <button
          className="bookmark-btn"
          onClick={foundId === undefined ? () => saveBookmark(id) : openModal}>
          <BsFillHeartFill
            style={{
              width: '15px',
              height: '14px',
              color: foundId === undefined ? '#fff' : '#F15E54',
            }}
          />
        </button>
        <img src={image_url} alt={name} width="50" height="50" />
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this bookmark?</p>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      )}
      <div className="description" onClick={() => handleItemClick(business)}>
        <div className="description-inner">
          <div className="description-inner-row-one">
            <h4>{name}</h4>
            <p style={{ color: openStatus ? '#25807A' : '#98A3AD' }}>
              {openStatus ? 'open' : 'closed'}
            </p>
          </div>
          <p>
            {location.address1},<br />
            {location.city}, {location.state} {location.zip_code}
          </p>
          <p>
            <BsStarFill className="star-icon" />
            {rating}
            <span className="review-count">({formatNumber(review_count)})</span>
          </p>
        </div>
      </div>
    </li>
  );
};

export default BusinessListItem;
