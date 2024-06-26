import './App.css';
import { useState } from 'react'; // Add this
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'; // Add this
import Home from './pages/home';
import Chat from './pages/chat';

const socket = io.connect('https://mern-chat-production-6f2d.up.railway.app/'); // Add this -- our server will run on port 4000, so we connect to it from here
// const socket = io.connect('http://localhost:4000'); // Add this -- our server will run on port 4000, so we connect to it from here

function App() {
  const [username, setUsername] = useState(''); // Add this
  const [room, setRoom] = useState(''); // Add this
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home
            username={username} // Add this
            setUsername={setUsername} // Add this
            room={room} // Add this
            setRoom={setRoom} // Add this
            socket={socket} // Add this
          />} />
          <Route path='/chat'
            element={<Chat
              username={username}
              room={room}
              socket={socket} />}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;