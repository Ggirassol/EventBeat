import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../../api";
import getDates from "../../getDatesfunc";
import './singleEvent.css'

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
      <h3>{getDates(eventDate).weekday}, {getDates(eventDate).day} {getDates(eventDate).month} {getDates(eventDate).year}</h3>
      <img src={singleEvent.images[8].url}/>
    </div>
  );
};

export default SingleEvent;
