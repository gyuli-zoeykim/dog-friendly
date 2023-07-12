import './BusinessDetail.css';
import { useNavigate, useLocation } from 'react-router-dom';

const BusinessDetail = ({
  business,
  handleGetDirectionsClick,
  bookmark,
  saveBookmark,
  deleteBookmark,
  formatNumber,
}) => {
  const { id, name, rating, review_count, location, image_url, hours } =
    business;
  const navigate = useNavigate();
  const locate = useLocation();
  const foundId = bookmark.find((number) => number === id);
  const renderHours = () => {
    if (hours && hours[0] && hours[0].open) {
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      return daysOfWeek.map((day, index) => {
        const matchingHour = hours[0].open.find((hour) => hour.day === index);

        if (matchingHour) {
          const startHour = parseInt(matchingHour.start.slice(0, 2), 10);
          const endHour = parseInt(matchingHour.end.slice(0, 2), 10);
          const startMinutes = matchingHour.start.slice(2);
          const endMinutes = matchingHour.end.slice(2);
          const startTime = `${
            startHour % 12 === 0 ? 12 : startHour % 12
          }:${startMinutes}${startHour >= 12 ? 'PM' : 'AM'}`;
          const endTime = `${
            endHour % 12 === 0 ? 12 : endHour % 12
          }:${endMinutes}${endHour >= 12 ? 'PM' : 'AM'}`;

          return (
            <div key={index}>
              <p>
                {startTime} - {endTime}
              </p>
              <p>{day}</p>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <p>Closed</p>
              <p>{day}</p>
            </div>
          );
        }
      });
    }
    return null;
  };

  const handleBackClick = () => {
    if (locate.pathname.includes('/search-results')) {
      navigate('/search-results');
    } else if (locate.pathname.includes('/bookmark')) {
      navigate('/bookmark');
    }
  };

  return (
    <div>
      <h2>{name}</h2>
      {hours[0].is_open_now ? <p>Open</p> : <p>Closed</p>}
      <div
        onClick={
          foundId === undefined
            ? () => saveBookmark(id)
            : () => deleteBookmark(id)
        }>
        <img src={image_url} alt={name} width="50" height="50" />
      </div>
      <p>
        Rating: {rating} ({formatNumber(review_count)})
      </p>
      <p>
        {location.address1}, {location.city}, {location.state}{' '}
        {location.zip_code}
      </p>
      <div>
        <h3>Hours of Operation</h3>
        {renderHours()}
      </div>
      <button onClick={handleBackClick}>Back</button>
      <button onClick={() => handleGetDirectionsClick(business)}>
        Get Directions
      </button>
    </div>
  );
};

export default BusinessDetail;
