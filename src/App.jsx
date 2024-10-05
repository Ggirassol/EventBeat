import "./App.css";
import { Route, Routes } from 'react-router-dom';
import EventList from './components/EvenList/EventList'

function App() {
  return (
    <>
      <div>
        <h1>EventBite</h1>
      </div>
      <Routes>
        <Route path='/' element={<EventList />}/>
      </Routes>
    </>
  );
}

export default App;
