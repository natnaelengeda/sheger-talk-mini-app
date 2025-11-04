import { useEffect, useState } from 'react';

import { Button } from '@telegram-apps/telegram-ui';

// state
import { UserState } from '@/state/user';
import { useSelector } from 'react-redux';

// socket.io
import { useSocket } from '@/context/SocketProvider';

// utils
import axios from "@/utils/axios";
import toast from 'react-hot-toast';

// styles
import "@/styles/start-page-style.css";

// app asset
import AppAsset from '@/core/AppAsset';
import { retrieveLaunchParams } from '@tma.js/sdk-react';

export default function PageStart() {
  const user = useSelector((state: { user: UserState }) => state.user);
  const socket = useSocket();
  const lp = retrieveLaunchParams();
  const { button_color } = lp.tgWebAppThemeParams;

  const [loading, setloading] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);

  const searchFunction = () => {
    setloading(true);
    axios.get(`/online/${user.socketId}`)
      .then((response) => {
        const status = response.status;

        if (status == 200) {
          const random_socket_id = response.data.id;
          setShowWaiting(true);
          socket?.emit(
            "request-connection",
            {
              sender_socket_id: user.socketId,
              reciever_socket_id: random_socket_id
            });
        } else if (status == 201) {
          toast.error("Unable to Find Someone for you");
          setloading(false);
        }
      }).catch(() => {
        toast.error("Unable to Find Someone for you");
        setloading(false);
      });
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (showWaiting) {
      timer = setTimeout(() => {
        setShowWaiting(false);
        setloading(false);
        toast.error("No response received. Please try again.");
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [showWaiting]);

  return (
    <div
      className='relative w-full h-full flex flex-col items-center justify-start pt-40 gap-10 water-heartbeat'>
      {/* Sheger Talk Logo */}
      <div
        className='relative w-full h-full flex items-center justify-center'>
        <img
          className={`relative w-32 h-32 rounded-2xl border border-gray-300 shadow-xl object-contain z-10 ${loading ? "heartbeat" : ""}`}
          src={AppAsset.logo}
          alt="Sheger Talk Logo" />
        <section
          className={loading ? "micro" : ""}>
        </section>
      </div>
      <div className='flex flex-col items-center justify-start gap-5'>
        <p
          style={{
            zIndex: 3,
          }}
          className='text-xl relative'>
          Start Chatting With People Online
        </p>
        {
          showWaiting &&
          <p>Waiting for them to Accept</p>
        }
      </div>

      <div className={`${showWaiting ? "pt-1" : "pt-10"}`}>
        <Button
          style={{
            backgroundColor: button_color,
            height: 50,
            width: 160,
          }}
          onClick={searchFunction}
          disabled={loading}>
          {
            loading ?
              <p >Looking...</p> :
              <p className='text-lg'>Start Looking</p>
          }
        </Button>
      </div>

    </div>
  )
}
