import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('xona_odamlari', (data) => {
      
      console.log(data);
      setRoomUsers(data);
    });
    // if(localStorage.getItem('name')&&localStorage.getItem('room')){


    //   setRoomUsers({
        
    //   })  
    // }
    
    return () => socket.off('xona_odamlari');
  }, []);

  const leaveRoom = () => {
    const createDateTime = Date.now();
    socket.emit('xonadan_chiqish', { username, room, createDateTime });
    localStorage.removeItem('name')
    localStorage.removeItem('room')
    // Redirect to home page
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <ul className={styles.usersList}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;