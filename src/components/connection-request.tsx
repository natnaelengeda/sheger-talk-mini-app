"use client";
import { useState, useEffect } from "react";

// components
import {  Snackbar, Text } from "@telegram-apps/telegram-ui";

// state
import { UserState } from "@/state/user";
import { useSelector } from "react-redux";

// socket.io
import { useSocket } from "@/context/SocketProvider";

// icons
import { FaUserFriends } from "react-icons/fa";

interface IConnectionRequest {
  sender_id: string | null;
  onComplete?: () => void; // optional callback when finished
}

export default function ConnectionRequest({ sender_id,  onComplete }: IConnectionRequest) {
  const [visible, setVisible] = useState(true);


  const handleSnackbarClose = () => {
    setVisible(false);
  };

  const user = useSelector((state: { user: UserState }) => state.user);
  const socket = useSocket();

  const AcceptFunction = () => {
   handleSnackbarClose();
    socket?.emit("accept-chat-request",
      {
        sender_socket_id: sender_id,
        reciever_socket_id: user.socketId
      },
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // optional callback after exit animation
      setTimeout(() => onComplete?.(), 500);// match exit animation duration
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);


  return (
    <>
     {(visible && sender_id) 
    //  {(true) 
     && (
              <Snackbar
              children="Someone Wants to Talk"
                description="Accept before 10 Seconds"
                duration={100000}
                onClose={handleSnackbarClose}
                before={
                    <FaUserFriends className="text-2xl"/>
                }
                after={
                  <Text 
                  onClick={AcceptFunction}>
                    Connect
                  </Text>
                }
              />
            )}
    </>
  );
}
