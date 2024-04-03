import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate()
  // Add this
  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('xonaga_qoshilayapman', { username, room });
      localStorage.setItem('name',username)
      localStorage.setItem('room', room)
      // Redirect to /chat
      navigate('/chat', { replace: true }); // Add this
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input
          className={styles.input}
          placeholder='Username...'
          onChange={(e) => setUsername(e.target.value)} // Add this
        />


        <select
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)} // Add this
        >
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button className='btn btn-secondary' style={{ width: '100%' }} onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Home;