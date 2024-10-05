import { useState, useEffect } from "react";
import { getAllEvents } from "../../../api";
import "./EventList.css";
import Eventcard from "../EventCard/EventCard";

const AllEvents = () => {
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState([]);

  useEffect(() => {
    getAllEvents(page)
      .then(({ data }) => {
        setTotalPages(data.page.totalPages);
        setEventList((prevEvents) => [...prevEvents, ...data._embedded.events]);
      })
      .catch((err) => {
        console.log(err); // set error later
      });
  }, [page]);

  function loadMore() {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  }

  return (
    <>
      <ul className="event-list">
        {eventList.map((event) => {
          return <Eventcard key={event.id} event={event} />;
        })}
      </ul>
      {page < totalPages - 1 && <button onClick={loadMore}>Load More</button>}
    </>
  );
};

export default AllEvents;
