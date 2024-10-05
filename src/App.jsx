import "./App.css";
import { Route, Routes } from 'react-router-dom';
import EventList from './components/EvenList/EventList'
import SingleEvent from './components/SingleEvent/SingleEvent';

function App() {
  return (
    <>
      <div className="header">
        <h1>EventBite</h1>
      </div>
      <Routes>
        <Route path='/' element={<EventList />}/>
        <Route path='/events/:event_id' element={<SingleEvent />}/>
      </Routes>
    </>
  );
}

export default App;
