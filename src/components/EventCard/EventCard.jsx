import "./EventCard.css";

const Eventcard = ({ event }) => {
  return (
    <li className="event-card">
      <div>
        <div>
          <p>{event.dates.start.localDate}</p>
        </div>
        <div>
          <p>{event.dates.start.localTime.slice(0, -3)}</p>
          <p className="bold">{event.name}</p>
          <p>
            <span>{event._embedded.venues[0].city.name} - </span>
            <span>{event._embedded.venues[0].name}</span>
          </p>
        </div>
      </div>
      <div>
        <p>Sign Up</p>
      </div>
    </li>
  );
};

export default Eventcard;
