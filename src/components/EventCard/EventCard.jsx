import "./EventCard.css";
import { Link } from "react-router-dom";
import getDates from "../../getDatesfunc";
import { useState } from "react";

const Eventcard = ({ event }) => {

  const [isTicketmasterEvent] = useState(event._embedded ? true : false)
  const date = isTicketmasterEvent ? event.dates.start.localDate : event.eventLocalDate;
  
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
            <span>{isTicketmasterEvent ? event.dates.start.localTime.slice(0, -3) : event.eventLocalTime}</span>
          </p>
          <p className="bold">{isTicketmasterEvent ? event.name : event.eventName}</p>
          <p>
            <span>{isTicketmasterEvent ? event._embedded.venues[0].city.name : event.eventVenue} - </span>
            <span>{isTicketmasterEvent ? event._embedded.venues[0].name : event.eventVenueCity}</span>
          </p>
        </div>
      </div>
      <div className="see-more">
      <Link target="_blank" className="see-more-link" to={`/events/${event.id}`}>
          <p>More Info</p>
        </Link>
      </div>
    </li>
  );
};

export default Eventcard;
