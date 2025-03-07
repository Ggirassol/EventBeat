import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../../api";
import getDates from "../../getDatesfunc";
import "./singleEvent.css";
import { UserContext } from "../../../UserContext";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue, update} from "firebase/database";

const SingleEvent = () => {
  const { event_id } = useParams();
  const [singleEvent, setSingleEvent] = useState(null);
  const { user } = useContext(UserContext);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [isTicketmasterEvent, setIsTicketmasterEvent] = useState(null)
  const [addedToGoogleCalendar, setAddedToGoogleCalendar] = useState(false)
  const [notFound, setNotFound] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDurationSelected, setIsDurationSelected] = useState(false)
  const [duration, setDuration] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const DISCOVERY_DOCS = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  const hours = [];
  for (let i=1; i<=24; i++) {
    hours.push(i)
  }

  console.log(singleEvent)

  useEffect(() => {
    if (window.gapi) {
      gapi.load('client', initializeGapiClient);
    };
    gisLoaded();
  }, []);

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: [DISCOVERY_DOCS],
    });
    setGapiInited(true);
  }

  function gisLoaded() {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
    });
    setTokenClient(client);
    setGisInited(true);
  }


  function handleAuthClick() {
    if (!gapiInited || !gisInited || !tokenClient) {
      alert("An error has occurred... Please try again later.");
      return;
    }
  
    tokenClient.callback = (resp) => {
      if (resp.error !== undefined) {
        console.error(resp);
        alert("Error during Google authentication. Please try again.");
        return;
      }
      setIsModalVisible(true)
    };
  
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      setIsModalVisible(true)
    }
  }

  function addToGoogleCalendar() {
    const startDateTime =  turnIntoGoogleDateTimeEventFormat(eventDate, (isTicketmasterEvent
      ? singleEvent.dates.start.localTime
      : singleEvent.eventLocalTime+":00"));
    const endDateTime = addDurationTo(duration, startDateTime);
    const event = {
      summary: isTicketmasterEvent ? singleEvent.name : singleEvent.eventName,
      location: isTicketmasterEvent ? singleEvent._embedded.venues[0].name : singleEvent.eventVenue,
      start: {
        dateTime: startDateTime,
        timeZone: "Europe/London",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Europe/London",
      },
      reminders: {
        useDefault: true,
      },
    };
    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
    
    request.execute(function(event) { 
      update(ref(db, `users/${user.uid}/events/${event_id}`), {
        addedToCalendar: true
      })
      .then(() => {
        setAddedToGoogleCalendar(true);
      })
      .catch(() => {
        alert('Error. Try again later');
      })
    });
  }


  function turnIntoGoogleDateTimeEventFormat(date, time) {
    let googleEventDateTime = "";
    googleEventDateTime = `${date}T${time}+00:00`;
    return googleEventDateTime;
  }

  function addDurationTo(howManyHours, dateTime) {
    const string = dateTime.split("+");
    const initial = new Date(string[0]);
    const initialPlusOne = new Date(initial.getTime() + howManyHours * 60 * 60 * 1000);
    const endTime = initialPlusOne.toISOString().replace('Z', '+00:00');
    return endTime;
  }

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

  function checkAddedToGoogleCalendar(userId, eventId) {
    const calendarRef = ref(db, `users/${userId}/events/${eventId}/addedToCalendar`);
    onValue(calendarRef, (snapshot) => {
      if (snapshot.val() === null) {
        setAddedToGoogleCalendar(false)
      } else {
        setAddedToGoogleCalendar(true)
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
        })
        .catch((err) => {
      console.error(err);
      setNotFound(true);
    });
      }
      checkHasSignedUp(user.uid, event_id);
      checkAddedToGoogleCalendar(user.uid, event_id)
    })

  }, []);

  function signUpForEvent(userId, eventId) {
    const eventRef = ref(db, `users/${userId}/events/${eventId}`);
    const eventName = isTicketmasterEvent ? singleEvent.name : singleEvent.eventName;
    set(eventRef, {
      eventName: eventName,
      eventLocalDate: isTicketmasterEvent ? singleEvent.dates.start.localDate : singleEvent.eventLocalDate,
      eventLocalTime: isTicketmasterEvent ? singleEvent.dates.start.localTime.slice(0, -3) : singleEvent.eventLocalTime,
      eventGenre: isTicketmasterEvent ? singleEvent._embedded.venues[0].name : singleEvent.eventVenue,
      eventPictureUrl: isTicketmasterEvent ? singleEvent.images[8].url : singleEvent.eventPictureUrl,
      eventSegment: isTicketmasterEvent ? singleEvent.classifications[0].segment.name : singleEvent.eventSegment,
      eventSubGenre: isTicketmasterEvent ? singleEvent.classifications[0].subGenre.name : singleEvent.eventSubGenre,
      eventSubType: isTicketmasterEvent ? singleEvent.classifications[0].subType.name : singleEvent.eventSubType,
      eventVenue: isTicketmasterEvent ? singleEvent._embedded.venues[0].name : singleEvent.eventVenue,
      eventVenueAddress: isTicketmasterEvent ? singleEvent._embedded.venues[0].address : singleEvent.eventVenueAddress,
      eventVenueCity: isTicketmasterEvent? singleEvent._embedded.venues[0].city.name : singleEvent.eventVenueCity
    })
    .then(() => {
      setHasSignedUp(true);
    })
    .catch(() => {
      alert('Error. Try again later');
    })
  }

  function handleModalSubmit() {
    if (duration) {
      setIsDurationSelected(true);
      setIsModalVisible(false);
      addToGoogleCalendar();
    } else {
      alert ("Please select event duration.")
    }
  }

  if (notFound) {
    return (
      <div className="not-found">
        <h1>Error 404 - Event Not Found</h1>
        <p>Event doesn't exist.</p>
      </div>
    );
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
            {isTicketmasterEvent ? (singleEvent.dates.start.localTime && singleEvent.dates.start.localTime.slice(0, -3)) : singleEvent.eventLocalTime && singleEvent.eventLocalTime}
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
          <div>
            <p className="signed-up bold">You are going to this event!</p>
            {!addedToGoogleCalendar ?
              <button className="add-to-calendar-btn" onClick={() => handleAuthClick()}>
                Add to Google Calendar
              </button> :
              <p className="added-to-calendar">Added to Google Calendar</p>
              }
          </div>
        ) : (
          <button onClick={() => signUpForEvent(user.uid, event_id)}>
            Sign Up
          </button>
        )}
      </div>
      {isModalVisible && (
        <div className="modal">
          <div className="content">
            <p>How many hours is your event?</p>
            <div className="options">
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">hours</option>
                {hours.map((hour) => {
                  return (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className="submit-btn" onClick={() => handleModalSubmit()}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleEvent;
