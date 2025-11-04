import { useEffect, useState } from 'react'

import { useSocket } from '@/context/SocketProvider';
import { motion, AnimatePresence } from "framer-motion";
import { retrieveLaunchParams } from '@tma.js/sdk-react';

interface PageProps {
  pageState: string;
}

export default function OnlineCounter({ pageState }: PageProps) {
  const lp = retrieveLaunchParams();
  const { bg_color } = lp.tgWebAppThemeParams;

  const socket = useSocket();
  const [onlineUsersNo, setOnlineUsersNo] = useState(0);


  useEffect(() => {
    socket?.on("update-online-users", (data) => {
      setOnlineUsersNo(data);
    });
  }, [socket]);

  const isVisible = onlineUsersNo > 1 && pageState !== "messaging";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="online-counter"
          initial={{ opacity: 0, x: 300 }}       // Start off-screen to the right
          animate={{ opacity: 1, x: 0 }}        // Slide in to position
          exit={{ opacity: 0, x: 300 }}         // Slide out to the right
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className='absolute top-24 right-0 w-auto min-w-40 h-10 flex items-center justify-end pr-4'>
          {/* Main Content */}
          <div
            style={{
              backgroundColor: bg_color
            }}
            className={`relative flex flex-row items-center justify-start gap-2 text-sm font-bold uppercase border border-slate-700 px-3 py-2 rounded-lg shadow`}>
            {/* Green Online Dot */}
            <div className='w-[25px] h-[25px] relative flex items-center justify-center'>
              <div className='w-[15px] h-[15px] rounded-full bg-[#62bd19] relative z-40'></div>
              <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center'>
                <div className='w-[25px] h-[25px] rounded-full ringring'></div>
              </div>
            </div>
            {/* No of Users */}
            <p>{onlineUsersNo} Users</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
