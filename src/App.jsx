import "./App.css";
import { Route, Routes } from 'react-router-dom';
import AllEvents from './components/AllEvents/AllEvents'

function App() {
  return (
    <>
      <div>
        <h1>EventBite</h1>
      </div>
      <Routes>
        <Route path='/' element={<AllEvents />}/>
      </Routes>
    </>
  );
}

export default App;
