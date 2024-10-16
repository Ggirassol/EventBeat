import { useState, useEffect, useContext } from "react";
import { getAllEvents } from "../../../api";
import "./EventList.css";
import Eventcard from "../EventCard/EventCard";
import{ UserContext} from "../../../UserContext";
import Login from '../Login/Login'
import { onValue, ref } from "firebase/database";
import { db } from "../../../firebaseConfig";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const [ticketmasterEvents, setTicketmasterEvents] = useState([]);
  const [firebaseEvents, setFirebaseEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useContext(UserContext);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    getAllEvents(page)
      .then(({ data }) => {
        setTotalPages(data.page.totalPages);
        setTicketmasterEvents((prevEvents) => [...prevEvents, ...data._embedded.events]);
      })
      .catch((err) => {
        console.log(err); // set error later
      });
  }, [page]);

  useEffect(() => {
    const eventsRef = ref(db, 'events/');
    onValue(eventsRef, (snapshot) => {
      const firebaseEventsData = snapshot.val();
      const firebaseEventsList = [];

      for (const id in firebaseEventsData) {
        firebaseEventsList.push({ id, ...firebaseEventsData[id] });
      }

      setFirebaseEvents(firebaseEventsList);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const staffRef = ref(db, `users/${user.uid}/isStaff`);
      onValue(staffRef, (snapshot) => {
        setIsStaff(snapshot.val());
      });
    }
  }, [user]);

  const allEvents = [...firebaseEvents, ...ticketmasterEvents];

  function loadMore() {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  }
  console.log(user)

  return (
    <>
    {!user ? <Login/> : (
        <div>
          {isStaff && (
            <Link target="_blank" to="/create" className="add-event-link">
              <p>+</p>
            </Link>
          )}

          <ul className="event-list">
            {allEvents.map((event) => (
              <Eventcard key={event.id} event={event} />
            ))}
          </ul>

          {page < totalPages - 1 && <button onClick={loadMore}>Load More</button>}
        </div>
      )}
    </>
  );
};

export default AllEvents;