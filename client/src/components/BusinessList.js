import BusinessListItem from './BusinessListItem';

const BusinessList = ({ businesses, handleItemClick }) => {
  return (
    <ul>
      {businesses.map((business) => (
        <BusinessListItem
          key={business.id}
          business={business}
          handleItemClick={handleItemClick}
        />
      ))}
    </ul>
  );
};

export default BusinessList;
