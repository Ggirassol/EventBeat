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

function App() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <div className="header">
        <h1>EventBite</h1>
      </div>
      {loading ? <div className="loading">Loading...</div> : 
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:event_id" element={<SingleEvent />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      }
    </>
  );
}

export default App;
