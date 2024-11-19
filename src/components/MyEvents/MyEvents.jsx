import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext";
import { onValue, ref } from "firebase/database";
import { db } from "../../../firebaseConfig";
import Logout from "../Logout/Logout";
import Login from "../Login/Login";
import NavBar from "../NavBar/NavBar";
import Eventcard from "../EventCard/EventCard";
import './MyEvents.css'

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userEventsRef = ref(db, `users/${user.uid}/events`);
      onValue(userEventsRef, (snapshot) => {
        const events = snapshot.val() || {};

        const eventsArray= [];
        for (const event in events) {
          eventsArray.push({eventId: event, ...events[event]})
        }

        const sortedEvents = Object.values(eventsArray).sort(
          (a, b) => new Date(a.eventLocalDate) - new Date(b.eventLocalDate)
        );

        setMyEvents(sortedEvents);
        setLoading(false);
      });
    }
  }, [user]);

  function top() {
    scrollTo(0, 0);
  }

  return (
    <div className="myEvents">
      {!user ? (
        <Login />
      ) : (
        <div>
          <NavBar/>
          <Logout/>
          {loading ? (
            <p className="loading">Loading...</p>
          )
          : 
          (Object.keys(myEvents).length > 0 ?
          <div>
            <ul className="event-list">
              {myEvents.map((event) => (
                <Eventcard key={event.eventId} event={event} />
              ))}
            </ul>
            <button className="scroll-to-top-btn" onClick={top}>
              back to top
            </button>
          </div>
          : 
          <p className="empty-events">You haven't signed up for any events yet.</p>
          )
          }
        </div>
      )}
    </div>
  );
};

export default MyEvents;
