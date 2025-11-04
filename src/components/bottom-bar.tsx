import React, { Dispatch, SetStateAction, useState } from 'react'

// state
import { useSelector } from 'react-redux';
import { UserState } from '@/state/user';

// socket.io
import { useSocket } from '@/context/SocketProvider';

// emoni-picker
import EmojiPicker,
{
  EmojiClickData,
  EmojiStyle,
  SuggestionMode,
  Theme,
} from 'emoji-picker-react';

import { Button, Input } from '@telegram-apps/telegram-ui';

// types
import { PageState } from '@/interface/pageState';
import { IMessageData } from '@/interface/message';

// utils
import toast from 'react-hot-toast';
import AppToast from '@/core/AppToast';
import { generateRandomId } from '@/utils/randomIdGenerator';

// icons
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { retrieveLaunchParams } from '@tma.js/sdk-react';
import CancelAlert from './cancel-alert';

interface BottomBarProps {
  pageState: PageState;
  setPageState: Dispatch<SetStateAction<PageState>>;
  setCurrentMessage: Dispatch<SetStateAction<string>>;
  setMessageList: Dispatch<SetStateAction<IMessageData[] | []>>;
}

export default function BottomBar({ pageState, setPageState, setCurrentMessage, setMessageList }: BottomBarProps) {
  const socket = useSocket();
  const user = useSelector((state: { user: UserState }) => state.user);
  const lp = retrieveLaunchParams();
  const { bg_color, section_separator_color } = lp.tgWebAppThemeParams;

  const [emojiOpened, setEmojiOpened] = useState(false);
  const [cancelOpened, setCancelOpened] = useState(false);

  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const [message, setMessage] = useState("");

  const emojiClicked = (emojiData: EmojiClickData) => {
    setMessage(prevousString => prevousString + emojiData.emoji);
  }

  const cancelChat = () => {
    try {
      // setCancelLoading(true);
      const room = localStorage.getItem("room");

      const data = {
        userId: user.userId,
        room: room,
        socketId: user.socketId,
      }

      socket?.emit("leave-room", data);

      AppToast.chatEnded();

      // Reset Page
      setPageState(PageState.Start);
      setCurrentMessage("");
      setMessageList([]);
      setCancelOpened(false);
      setCancelLoading(false);

      localStorage.setItem("room", "");
    } catch (error) {
      console.error(error);
    }
  }

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    // handleTyping();
  }

  const sendMessage = () => {
    if (message == "") {
      toast("Enter Message to Send");
    } else {
      const date = new Date();
      const room = localStorage.getItem("room");

      const messageData: IMessageData = {
        id: generateRandomId(25),
        room: room || "",
        message: message,
        socket_id: user.socketId,
        time: date.toISOString(),
      };

      // Send Message
      socket?.emit("send_message", messageData);

      // Close Emoji Tab
      setEmojiOpened(false);

      // Set Current Message List
      setMessageList((list: IMessageData[]) => {
        if (list.some((msg: IMessageData) => msg.id === messageData.id)) {
          return list;
        } else {
          return [...list, messageData];
        }
      });

      setCurrentMessage("");
      setMessage("");
    }
  }

  // Send Message on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }


  // Typing Indicator
  // const handleTyping = () => {
  //   const room = localStorage.getItem("room");

  //   const typingData: ITypingData = {
  //     id: generateRandomId(25),
  //     room: room || "",
  //     socket_id: user.socketId,
  //     isTyping: true,
  //   };

  //   const typingDataEnd: ITypingData = {
  //     id: generateRandomId(25),
  //     room: room || "",
  //     socket_id: user.socketId,
  //     isTyping: false,
  //   }

  //   socket?.emit("client_typing", typingData);

  //   setTimeout(() => socket?.emit("client_typing", typingDataEnd), 1000); // Stop after 2s
  // };

  return (
    <div
      style={{
        display: pageState == PageState.Start ? "none" : "",
        // backgroundColor: bg_c
      }}
      className='relative w-full'>
      {/* Text Bar */}
      <div
        style={{
          backgroundColor: bg_color
        }}
        className={`fixed bottom-0 left-0 w-full h-16 border-t border-[${section_separator_color}] flex flex-row items-center justify-start pr-2 gap-2 overflow-hidden`}>

        {/* Text Input */}
        <div
          className='w-full relative'>
          <Input
            style={{
              // backgroundColor: bg_color
            }}
            className='outline-none! !focus:outline-none !focus:ring-2 !focus:ring-blue-400 !focus:ring-offset-0'
            placeholder='Enter message...'
            value={message}
            onChange={changeText}
            onKeyDown={handleKeyDown} />
          <div
            className='h-full absolute top-0 right-5 flex flex-col items-center justify-center pr-3'>
            <MdOutlineEmojiEmotions
              onClick={() => setEmojiOpened(!emojiOpened)}
              className="text-2xl" />
          </div>
        </div>
        <div
          className=''>
          {
            message == "" ?
              <Button
                onClick={() => setCancelOpened(true)}>
                Cancel
              </Button> :
              <Button
                onClick={sendMessage}>
                Send
              </Button>

          }
        </div>
      </div>
      {/* Emoji Picker */}
      <div
        style={{
          display: !emojiOpened ? "none" : ""
        }}
        className='w-96 fixed bottom-20 right-0'>
        <EmojiPicker
          open={emojiOpened}
          theme={Theme.LIGHT}
          emojiStyle={EmojiStyle.APPLE}
          suggestedEmojisMode={SuggestionMode.FREQUENT}
          searchDisabled={true}
          skinTonesDisabled={true}
          lazyLoadEmojis={false}
          onEmojiClick={emojiClicked}
          height={500}
          width={"90%"} />
      </div>

      <CancelAlert
        open={cancelOpened}
        setCancelOpened={setCancelOpened}
        cancelChat={cancelChat}
        cancelLoading={cancelLoading} />
    </div>
  )
}
