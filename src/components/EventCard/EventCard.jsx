import "./EventCard.css";

const Eventcard = ({ event }) => {

  const date = event.dates.start.localDate
  const d = new Date(date);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <li className="event-card">
      <div className="event-info">
        <div className="event-date">
          <p className="day bold">{d.getDay()}</p>
          <p className="month bold">{months[d.getMonth()]}</p>
          <p className="year">{d.getFullYear()}</p>
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
