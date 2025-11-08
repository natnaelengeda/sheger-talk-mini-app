// hooks/useTelegramRegistration.ts
import { useEffect } from 'react';
import { useSocket } from '@/context/SocketProvider';
import { login_telegram, UserState } from '@/state/user';
import { initData, useSignal } from '@tma.js/sdk-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "@/utils/axios";

export function useTelegramRegistration() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user);
  const initDataState = useSignal(initData.state);

  useEffect(() => {
    if (!socket) return;
    if (!user.userId) return;
    if (user.is_telegram_registered) return;

    console.log(user);

    dispatch(login_telegram({
      first_name: initDataState?.user?.first_name || "",
      last_name: initDataState?.user?.last_name || "",
      username: initDataState?.user?.username || "",
      photo_url: initDataState?.user?.photo_url || "",
      telegram_id: initDataState?.user?.id?.toString() || "",
    }));

    axios.post("/user/update-telegram-user",{
      id: user.userId,
      first_name:initDataState?.user?.first_name || "",
      last_name:  initDataState?.user?.last_name || "",
      username:initDataState?.user?.username || "",
      photo_url:initDataState?.user?.photo_url || "",
      telegram_id: initDataState?.user?.id?.toString() || "",
    });
  }, [socket,  user.userId,user.is_telegram_registered, initDataState]);
}
