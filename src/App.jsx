import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventList from "./components/EvenList/EventList";
import SingleEvent from "./components/SingleEvent/SingleEvent";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Create from "./components/Create/Create";
import MyEvents from "./components/MyEvents/MyEvents";

function App() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="header">
        <h1>EventBeat</h1>
      </div>
      {loading ? <div className="loading">Loading...</div> : 
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:event_id" element={<SingleEvent />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path='/my-events' element={<MyEvents/>} />
      </Routes>
      }
    </>
  );
}

export default App;
