import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

// state
import { UserState } from '@/state/user';
import { useSelector } from 'react-redux';
import { useSocket } from '@/context/SocketProvider';

// app assets
import AppToast from '@/core/AppToast';

// types
import { IMessageData, ITypingData } from '@/interface/message';

import MessageBox from './components/message-box';

// Styles
import "./styles/styles.css";

interface IMessagesPage {
  messageList: IMessageData[],
  setMessageList: Dispatch<SetStateAction<IMessageData[] | []>>;
}

export default function Messages({ messageList, setMessageList }: IMessagesPage) {
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    socket?.on("receive_message", (data) => {
      const inData: IMessageData = data;

      setMessageList((list: IMessageData[]) => {
        if (list.some((msg: IMessageData) => msg.id === inData.id)) {
          return list;
        } else {
          return [...list, inData];
        }
      });
    });
  }, [socket]);

  // Send Welcome Toast
  useEffect(() => {
    AppToast.welcomeNotify();
  }, []);

  // Scroll To Bottom After Message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  // Listen for typing events
  useEffect(() => {
    socket?.on("reciever_typing", (message) => {
      const data: ITypingData = message;
      if (data.socket_id != user.socketId) {
        // setTyping(data.isTyping);
      }
    });

    return () => {
      socket?.off("reciever_typing");
    };
  }, [socket]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messageList])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      style={{
        // backgroundColor: secondary_bg_color,
        background: 'url("./chat_background.svg")'
      }}
      className="w-full flex flex-col h-screen">
      <div className='h-28'>
      </div>
      {/* Messages container - flex-grow to take available space */}
      <div className="grow overflow-y-auto p-4 flex flex-col-reverse">
        <div className="flex flex-col">
          {/* Scroll anchor at the beginning of the reversed list */}
          <div ref={messagesEndRef} />

          {/* Messages displayed in chronological order */}
          {
            messageList.map((message: IMessageData) => {
              return <MessageBox
                userSocketId={user.socketId}
                messageSocketId={message.socket_id}
                message={message.message}
                time={message.time}
              />;
            })
          }
        </div>
      </div>
      <div ref={messagesEndRef} />
      <div className='h-16'>
      </div>
    </div>
  )
}
