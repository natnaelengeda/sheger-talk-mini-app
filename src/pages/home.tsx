import { useEffect, useState, type FC } from 'react';

// UI Libraries
import { List } from '@telegram-apps/telegram-ui';
import { Toaster } from 'react-hot-toast';

// React Redux / State
import { useSelector } from 'react-redux';
import { UserState } from '@/state/user';

// Hooks & Context
import { useSocket } from '@/context/SocketProvider';

// Components
import PageStart from '@/components/page-start';
import OnlineCounter from '@/components/online-counter';
import BottomBar from '@/components/bottom-bar';
import Messages from '@/components/messages';
import ConnectionRequest from '@/components/connection-request';
import { Page } from '@/components/page';

// Types / Interfaces / Enums
import { PageState } from '@/interface/pageState';
import { IMessageData } from '@/interface/message';

// Utilities / Core
import AppToast from '@/core/AppToast';

export const Home: FC = () => {
  //  useTelegramRegistration();

  // Socket
  const socket = useSocket();
  const user = useSelector((state: { user: UserState }) => state.user);
  console.log(user);
  // States
  const [pageState, setPageState] = useState<PageState>(PageState.Start);

  const [connectionRequest, setConnectionRequest] = useState<string | null>(null);

  // Messages
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Array<IMessageData> | []>([]);

  // useEffect(()=>{
  //   if(user.is_telegram_registered) return;
  //   axios.post("/user/update-telegram-user",{
  //     id: user.userId,
  //     first_name: user.first_name,
  //     last_name: user.last_name,
  //     username: user.username,
  //     photo_url: user.photo_url,
  //     telegram_id: user.telegram_id,
  //   });
  // },[user.is_telegram_registered]);

  useEffect(() => {
    if (!socket) return;

    socket.on("request-connection-client", (data) => {
      const sender_id = data.sender_socket_id;

      setConnectionRequest(sender_id);
      setTimeout(() => setConnectionRequest(null), 12000);
    });

    return () => {
      socket.off("request-connection-client");
    };
  }, [socket]);

  // Start Chat
  useEffect(() => {
    socket?.on("start-chat", (data) => {
      const dataJSON = data;

      const type = dataJSON.type;

      if (type == "sender") {
        const user1_id = dataJSON.user1_id;
        const user2_id = dataJSON.user2_id;

        const body = {
          type: dataJSON.type,
          userId: user.userId,
          user1_id: user1_id,
          user2_id: user2_id,
          room: dataJSON.room_id,
          socketId: user.socketId
        }

        socket?.emit("join-room", body);
      } else {
        const body = {
          type: dataJSON.type,
          userId: user.userId,
          room: dataJSON.room_id,
          socketId: user.socketId
        }

        socket?.emit("join-room", body);
      }

    });

    socket?.on("joined-room", (data) => {
      const dataJSON = data;
      const room = dataJSON.room_id;

      localStorage.setItem("room", room);
      setPageState(PageState.Messaging);
    });


    socket?.on("left-room", (data) => {
      const room = localStorage.getItem("room");

      if (room == data.room) {
        AppToast.chatEndedUser();

        setPageState(PageState.Start);
        setCurrentMessage("");
        setMessageList([]);

        const data = {
          userId: user.userId,
          room: room,
          socketId: user.socketId,
        };

        socket?.emit("l-room", data);
        localStorage.setItem("room", "");

      }
    })

    socket?.on("user-left-chat", (room) => {
      AppToast.UserDisconnected();

      setPageState(PageState.Start);
      setCurrentMessage("");
      setMessageList([]);

      const sendData = {
        userId: user.userId,
        room: room,
        socketId: user.socketId
      };

      socket?.emit("l-room", JSON.stringify(sendData));
      localStorage.setItem("room", "");
    })

  }, [socket]);

  if (false) console.log(currentMessage);

  return (
    <Page back={false}>
      <List>
       
        <div className='relative w-full h-full overflow-hidden'>
          <ConnectionRequest
            key={connectionRequest}
            sender_id={connectionRequest ?? ""} />

          {
            pageState == PageState.Start ?
              <PageStart /> :
              pageState == PageState.Messaging ?
                <Messages
                  messageList={messageList}
                  setMessageList={setMessageList} /> :
                null
          }
          <OnlineCounter
            pageState={pageState} />
          <BottomBar
            pageState={pageState}
            setPageState={setPageState}
            setCurrentMessage={setCurrentMessage}
            setMessageList={setMessageList} />
            <Toaster/>
        </div>
      </List>
    </Page>
  );
};
