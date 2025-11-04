"use client";

import { useSocket } from "@/context/SocketProvider";
import { UserState } from "@/state/user";
import { Button } from "@telegram-apps/telegram-ui";
import { retrieveLaunchParams } from "@tma.js/sdk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface IConnectionRequest {
  sender_id: string | null;
  onComplete?: () => void; // optional callback when finished
}

export default function ConnectionRequest({ sender_id, onComplete }: IConnectionRequest) {
  const [visible, setVisible] = useState(true);
  const lp = retrieveLaunchParams();
  const { button_color } = lp.tgWebAppThemeParams;


  const user = useSelector((state: { user: UserState }) => state.user);
  const socket = useSocket();

  const AcceptFunction = () => {

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
    <AnimatePresence>
      {
        (visible && sender_id) &&
        // (true) &&
        (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }} // slides up on exit
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20
            }}
            className="fixed top-5 left-5 -translate-x-1 z-50 w-[90%] max-w-md bg-white  rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2 relative">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Someone Wants to Talk with you...
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Accept before 10 Seconds
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => {
                    setVisible(false);
                    AcceptFunction();
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
                >
                  Accept
                </Button>
              </div>

              {/* Countdown bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{
                  duration: 10,
                  ease: "linear"
                }}
                style={{
                  backgroundColor: button_color
                }}
                className="absolute bottom-0 left-0 h-1 rounded-b-md"
              />
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
}
