import React from 'react';

const SearchForm = ({ searchAddress, setSearchAddress, handleSearch }) => {
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
