import { useState } from "react";
import '../Register/Register.css'
import { push, ref } from "firebase/database";
import { db } from "../../../firebaseConfig";

const Create = () => {

    const [eventName, setEventName] = useState("");
    const [eventLocalDate, setEventLocalDate] = useState("");
    const [eventLocalTime, setEventLocalTime] = useState("");
    const [eventVenue, setEventVenue] = useState("");
    const [eventSegment, setEventSegment] = useState("");
    const [eventGenre, setEventGenre] = useState("");
    const [eventSubGenre, setEventSubGenre] = useState("");
    const [eventSubType, setEventSubType] = useState("");
    const [eventVenueAddress, setEventVenueAddress] = useState("");
    const [eventVenueCity, setEventVenueCity] = useState("");
    const [eventPictureUrl, setEventPictureUrl] = useState("");
    const [eventIsSubmited, setEventIsSubmited] = useState(false);


    function undefiny (stringEvent) {
     if (stringEvent === '') {
         return "Undefined"
     } else {
         return stringEvent
     }
    }
    
    function onSubmitAddEvent(e) {
        e.preventDefault();

        if (!eventName || !eventLocalDate || !eventVenue || !eventVenueAddress || !eventVenueCity) {
            alert("Please fill in all manadatory fields.");
            return;
        }


        push(ref(db, 'events/'), {
            "eventName": eventName,
            "eventLocalDate": eventLocalDate,
            "eventLocalTime": eventLocalTime,
            "eventVenue": eventVenue,
            "eventSegment": eventSegment,
            "eventGenre": eventGenre,
            "eventSubGenre": undefiny(eventSubGenre),
            "eventSubType": undefiny(eventSubType),
            "eventVenueAddress": eventVenueAddress,
            "eventVenueCity": eventVenueCity,
            "eventPictureUrl": eventPictureUrl
          })
          .then(() => {
            alert('Event created successfully!')
            window.close();
          })
          .catch((error) => {
            console.error("Error creating event: ", error);
            alert("Error creating event. Please try again.");
        });
    }

    return (
        <>
          <div className="register-form">
            <form className="form" onSubmit={onSubmitAddEvent}>
              <label htmlFor="event name"><span>* </span>Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                id="eventName"
              ></input>
              <label htmlFor="event local date"><span>* </span>Event local date</label>
              <input
                type="text"
                value={eventLocalDate}
                onChange={(e) => setEventLocalDate(e.target.value)}
                id="EventLocalDate"
                placeholder="follow this format: 2012-12-12"
              ></input>
              <label htmlFor="event local time">Event local time</label>
              <input
                type="text"
                value={eventLocalTime}
                onChange={(e) => setEventLocalTime(e.target.value)}
                id="EventLocalTime"
                placeholder="follow this format: 22:30"
              ></input>
            <label htmlFor="event venue"><span>* </span>Venue</label>
              <input
                type="text"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                id="EventVenue"
              ></input>
              <label htmlFor="segment"><span>* </span>Segment</label>
              <input
                type="text"
                value={eventSegment}
                onChange={(e) => setEventSegment(e.target.value)}
                id="EventSegment"
              ></input>
              <label htmlFor="genre"><span>* </span>Genre</label>
              <input
                type="text"
                value={eventGenre}
                onChange={(e) => setEventGenre(e.target.value)}
                id="EventGenre"
              ></input>
              <label htmlFor="SubGenre">SubGenre</label>
              <input
                type="text"
                value={eventSubGenre}
                onChange={(e) => setEventSubGenre(e.target.value)}
                id="EventSubGenre"
              ></input>
              <label htmlFor="SubType">SubType</label>
              <input
                type="text"
                value={eventSubType}
                onChange={(e) => setEventSubType(e.target.value)}
                id="EventSubType"
              ></input>
              <label htmlFor="Venue Address"><span>* </span>Venue Address</label>
              <input
                type="text"
                value={eventVenueAddress}
                onChange={(e) => setEventVenueAddress(e.target.value)}
                id="EventVenueAddress"
              ></input>
              <label htmlFor="Venue City"><span>* </span>Venue City</label>
              <input
                type="text"
                value={eventVenueCity}
                onChange={(e) => setEventVenueCity(e.target.value)}
                id="EventVenueCity"
              ></input>
              <label htmlFor="Event Picture URL">Picture URL</label>
              <input
                type="text"
                value={eventPictureUrl}
                onChange={(e) => setEventPictureUrl(e.target.value)}
                id="EventPictureUrl"
              ></input>
              <p className="mandatory">All fields marked with <span>*</span> are required.</p>
              <button type="submit">Create</button>
            </form>
          </div>
        </>
    );
}

export default Create;