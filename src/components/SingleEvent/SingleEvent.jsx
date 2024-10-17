import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../../api";
import getDates from "../../getDatesfunc";
import "./singleEvent.css";
import Login from "../Login/Login";
import { UserContext } from "../../../UserContext";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue} from "firebase/database";

const SingleEvent = () => {
  const { event_id } = useParams();
  const [singleEvent, setSingleEvent] = useState(null);
  const { user } = useContext(UserContext);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [isTicketmasterEvent, setIsTicketmasterEvent] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);
  
  function checkHasSignedUp(userId, eventId) {
    const eventRef = ref(db, `users/${userId}/events/${eventId}`);
    onValue(eventRef, (snapshot) => {
      if (snapshot.val() === null) {
        setHasSignedUp(false)
      } else {
        setHasSignedUp(true)
      }
    })
  }

  useEffect(() => {
    const eventRef = ref(db, "events/" + event_id);
    onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        setIsTicketmasterEvent(false);
        setSingleEvent(eventData);
      } else {
        getEventById(event_id).then(({ data }) => {
          setIsTicketmasterEvent(true);
          setSingleEvent(data._embedded.events[0]);
        });
      }
      checkHasSignedUp(user.uid, event_id);
    });
  }, []);

  function signUpForEvent(userId, eventId) {
    const eventRef = ref(db, `users/${userId}/events/${eventId}`);
    const eventName = isTicketmasterEvent ? singleEvent.name : singleEvent.eventName;
    set(eventRef, {
      eventName: eventName,
    })
    .then(() => {
      setHasSignedUp(true);
    })
    .catch(() => {
      alert('Error. Try again later');
    })
  }

  if (!singleEvent) {
    return <div className="loading">Loading...</div>;
  }
  const eventDate = isTicketmasterEvent ? singleEvent.dates.start.localDate : singleEvent.eventLocalDate

  return (
    <>
        <div className="single-event">
          <h1>{isTicketmasterEvent ? singleEvent.name : singleEvent.eventName}</h1>
          <h3>
            {getDates(eventDate).weekday}, {getDates(eventDate).day}{" "}
            {getDates(eventDate).month} {getDates(eventDate).year}
          </h3>
          <p>{isTicketmasterEvent ? singleEvent._embedded.venues[0].name : singleEvent.eventVenue}</p>
          <p className="bold">
            {isTicketmasterEvent ? singleEvent.dates.start.localTime.slice(0, -3) : singleEvent.eventLocalTime}
          </p>
          <img src={isTicketmasterEvent ? singleEvent.images[8].url : singleEvent.eventPictureUrl} />
          <p className="genre">
            {isTicketmasterEvent ? singleEvent.classifications[0].segment.name !== "Undefined" && (
              <span>{singleEvent.classifications[0].segment.name} </span>
            ) : singleEvent.eventSegment !== "Undefined" && (
              <span>{singleEvent.eventSegment} </span>)}
            {isTicketmasterEvent ? singleEvent.classifications[0].genre.name !== "Undefined" && (
              <span>{singleEvent.classifications[0].genre.name} </span>
            ) : singleEvent.eventGenre && (
              <span>{singleEvent.eventGenre} </span>
            )}
            {isTicketmasterEvent ? singleEvent.classifications[0].subGenre.name !== "Undefined" && (
              <span>{singleEvent.classifications[0].subGenre.name} </span>
            ) : singleEvent.eventsubGenre && (
              <span>{singleEvent.eventsubGenre} </span>
            )}
            {isTicketmasterEvent ? singleEvent.classifications[0].subType.name !== "Undefined" && (
              <span>{singleEvent.classifications[0].subType.name} </span>
            ) : singleEvent.eventsubType && (
              <span>{singleEvent.eventSubType} </span>
            )}
          </p>
          <p className="adress bold">Adress:</p>
          {isTicketmasterEvent? Object.entries(singleEvent._embedded.venues[0].address).map(
            ([key, value]) => (
              <p key={key}>{value}</p>
            )
          ) : <p>{singleEvent.eventVenueAddress}</p>}
          <p>{isTicketmasterEvent? singleEvent._embedded.venues[0].city.name : singleEvent.eventVenueCity}</p>
          {hasSignedUp ? (
            <p className="signed-up">You signed up for this</p>
          ) : (
            <button onClick={() => signUpForEvent(user.uid, event_id)}>
              Sign Up
            </button>
          )}
        </div>
    </>
  );
};

export default SingleEvent;
