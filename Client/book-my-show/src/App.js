import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import SingleMovie from './pages/SingleMovie/SingleMovie';
import BookShow from './pages/BookShow/BookShow';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import Reset from './pages/Reset/Reset';
import UserBookings from './pages/UserBookings/UserBookings';


function App() {
  return (
    <div>
      <BrowserRouter>

      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/movie/:id' element={<SingleMovie/>} />
        <Route path='/movie/:movieId/book-show/:showId' element={<BookShow/>} />
        <Route path='/forget' element={<ForgetPassword/>} />
        <Route path='/reset' element={<Reset/>} />
        <Route path='/bookings' element={<UserBookings/>} />


      </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
