import { useState, useEffect, useContext } from "react";
import { getAllEvents } from "../../../api";
import "./EventList.css";
import Eventcard from "../EventCard/EventCard";
import{ UserContext} from "../../../UserContext";
import Login from '../Login/Login'
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../../firebaseConfig";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";
import NavBar from "../NavBar/NavBar";

const AllEvents = () => {
  const [ticketmasterEvents, setTicketmasterEvents] = useState([]);
  const [firebaseEvents, setFirebaseEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const [isStaff, setIsStaff] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEvents(page)
      .then(({ data }) => {
        setTotalPages(data.page.totalPages);
        setTicketmasterEvents((prevEvents) => [...prevEvents, ...data._embedded.events]);
        setError(null);
        setLoading(false)
      })
      .catch(() => {
        setError('An error occured while loading events. Try again later...')
      });
  }, [page]);

  useEffect(() => {
    const eventsRef = ref(db, 'events/');
    onValue(eventsRef, (snapshot) => {
      const firebaseEventsData = snapshot.val();
      const firebaseEventsList = [];

      for (const id in firebaseEventsData) {
        if (new Date().setHours(0, 0, 0, 0) <=
        new Date((firebaseEventsData[id].eventLocalDate)).setHours(0, 0, 0, 0)) {
          firebaseEventsList.push({ id, ...firebaseEventsData[id] });
        }
      }

      setFirebaseEvents(firebaseEventsList);
      setLoading(false)
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

  function top() {
  scrollTo(0,0)
 }

  return (
    <>
    {!user ? <Login/> : (
        <div>
          <NavBar/>
          <Logout/>
          {isStaff && (
            <Link target="_blank" to="/create" className="add-event-link">
              <p>+</p>
            </Link>
          )}
          {loading ? <p className="loading">Loading...</p> :
          error ? <p>{error}</p> :
          <ul className="event-list">
            {allEvents.map((event) => (
              <Eventcard key={event.id} event={event} />
            ))}
          </ul>
          }

          {page < totalPages - 1 && <button className='load-more-btn' onClick={loadMore}>Load More</button>}
          <button className="scroll-to-top-btn" onClick={top}>back to top</button>
        </div>

      )}
    </>
  );
};

export default AllEvents;