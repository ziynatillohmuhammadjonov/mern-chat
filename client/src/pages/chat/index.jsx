import styles from './styles.module.css';
import Messages from './messages.jsx';
import SendMessage from './send-message.jsx';
import RoomAndUsers from './room-and-users.jsx';

const Chat = ({ socket, username, room }) => {
  return (
    <div className={styles.chatContainer}>
       <RoomAndUsers socket={socket} username={username} room={room} />
      <div>
        <Messages socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;