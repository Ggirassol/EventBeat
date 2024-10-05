import "./EventCard.css";
import { Link } from "react-router-dom";
import getDates from "../../getDatesfunc";

const Eventcard = ({ event }) => {
  const date = event.dates.start.localDate;
  
  return (
    <li className="event-card">
      <div className="event-info">
        <div className="event-date">
          <p className="day bold">{getDates(date).day}</p>
          <p className="month bold">{getDates(date).month}</p>
          <p className="year">{getDates(date).year}</p>
        </div>
        <div>
          <p>
            <span>{getDates(date).weekday} </span>
            <span>{event.dates.start.localTime.slice(0, -3)}</span>
          </p>
          <p className="bold">{event.name}</p>
          <p>
            <span>{event._embedded.venues[0].city.name} - </span>
            <span>{event._embedded.venues[0].name}</span>
          </p>
        </div>
      </div>
      <div className="see-more">
        <Link className="see-more-link" to={`/events/${event.id}`} event={event}>
          <p>More Info</p>
        </Link>
      </div>
    </li>
  );
};

export default Eventcard;
