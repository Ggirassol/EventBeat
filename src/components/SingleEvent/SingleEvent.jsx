import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../../api";
import getDates from "../../getDatesfunc";
import "./singleEvent.css";

const SingleEvent = () => {
  const { event_id } = useParams();
  const [singleEvent, setSingleEvent] = useState(null);

  useEffect(() => {
    getEventById(event_id).then(({ data }) => {
      console.log(data._embedded.events[0]);
      setSingleEvent(data._embedded.events[0]);
    });
  }, []);

  if (!singleEvent) {
    return <div>Loading...</div>;
  }
  const eventDate = singleEvent.dates.start.localDate;

  return (
    <div className="single-event">
      <h1>{singleEvent.name}</h1>
      <h3>
        {getDates(eventDate).weekday}, {getDates(eventDate).day}{" "}
        {getDates(eventDate).month} {getDates(eventDate).year}
      </h3>
      <p>{singleEvent._embedded.venues[0].name}</p>
      <p className="bold">{singleEvent.dates.start.localTime.slice(0, -3)}</p>
      <img src={singleEvent.images[8].url} />
      <p className="genre">
        {singleEvent.classifications[0].segment.name !== "Undefined" && (
          <span>{singleEvent.classifications[0].segment.name} </span>
        )}
        {singleEvent.classifications[0].genre.name !== "Undefined" && (
          <span>{singleEvent.classifications[0].genre.name} </span>
        )}
        {singleEvent.classifications[0].subGenre.name !== "Undefined" && (
          <span>{singleEvent.classifications[0].subGenre.name} </span>
        )}
        {singleEvent.classifications[0].subType.name !== "Undefined" && (
          <span>{singleEvent.classifications[0].subType.name} </span>
        )}
      </p>
      <p className="adress bold">Adress:</p>
      {Object.entries(singleEvent._embedded.venues[0].address).map(
        ([key, value]) => (
          <p key={key}>{value}</p>
        )
      )}
      <p>{singleEvent._embedded.venues[0].city.name}</p>
      <button>Sign Up</button>
    </div>
  );
};

export default SingleEvent;
