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
  const [firebaseEventsLoaded, setFirebaseEventsLoaded] = useState(false);
  const [eventsToAdd, setEventsToAdd] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const [isStaff, setIsStaff] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setFirebaseEventsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (firebaseEventsLoaded) {
      getAllEvents(page)
      .then(({ data }) => {
        const fetchedEvents = data._embedded.events
        const firstFetched = fetchedEvents[0]
        const lastFetched = fetchedEvents[fetchedEvents.length-1]
        setTotalPages(data.page.totalPages);
        setTicketmasterEvents((prevEvents) => [...prevEvents, ...fetchedEvents]);
        for (let i=0; i<firebaseEvents.length; i++) {
          const firebaseDateAndTime = new Date (`${firebaseEvents[i].eventLocalDate}T${firebaseEvents[i].eventLocalTime}`)
          const lastFetchedDateAndTime = new Date(`${lastFetched.dates.start.localDate}T${lastFetched.dates.start.localTime}`)
          const firstFetchedDateAndTime = new Date(`${firstFetched.dates.start.localDate}T${firstFetched.dates.start.localTime}`)
          if (firebaseDateAndTime <= lastFetchedDateAndTime && firebaseDateAndTime >= firstFetchedDateAndTime) {
            setEventsToAdd((prevEvents) => [...prevEvents, firebaseEvents[i]]);
            setFirebaseEvents((prevfirebaseEvents) => prevfirebaseEvents.slice(1,prevfirebaseEvents.length-1))
          } 
          else {
            if (page !==0 && page === totalPages) {
              setEventsToAdd((prevEvents) => [...prevEvents, firebaseEvents[i]]);
            }
            if (page === 0 && firebaseDateAndTime <= lastFetchedDateAndTime) {
              setEventsToAdd((prevEvents) => [...prevEvents, firebaseEvents[i]]);
            }
          }
        }
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('An error occured while loading events. Try again later...')
      });
    }
  }, [page, firebaseEventsLoaded]);


  useEffect(() => {
    if (user) {
      const staffRef = ref(db, `users/${user.uid}/isStaff`);
      onValue(staffRef, (snapshot) => {
        setIsStaff(snapshot.val());
      });
    }
  }, [user]);

  const sortedEvents = [...ticketmasterEvents, ...eventsToAdd].sort((a, b) => {
    const timeA = a.eventLocalTime ? a.eventLocalTime : a.dates.start.localTime;
    const timeB = b.eventLocalTime ? b.eventLocalTime : b.dates.start.localTime;
    const dateA = a.eventLocalDate ? a.eventLocalDate : a.dates.start.localDate;
    const dateB = b.eventLocalDate ? b.eventLocalDate : b.dates.start.localDate;
    const dateAndTimeA = new Date(`${dateA}T${timeA}`);
    const dateAndTimeB = new Date(`${dateB}T${timeB}`);
    return dateAndTimeA - dateAndTimeB;
  });

  console.log(sortedEvents)

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
            {sortedEvents.map((event) => (
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