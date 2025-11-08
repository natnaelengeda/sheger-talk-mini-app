import
React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

// telegram-data
import { initData, useSignal } from "@tma.js/sdk-react";

// socket
import { io, Socket } from "socket.io-client";

// state
import { login, login_telegram, UserState } from "@/state/user";
import { useDispatch, useSelector } from "react-redux";

// utils
import { generateRandomName } from "@/utils/randomNameGenerator";

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({
  children,
  serverUrl
}: {
  children: React.ReactNode;
  serverUrl: string;
}) {
  const randomName = generateRandomName(6);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useSelector((state: { user: UserState }) => state.user);
  const initDataState = useSignal(initData.state);

  useEffect(() => {
    // Wait until telegram data or fallback is ready
    const tgUser = initDataState?.user;

    // You can decide to wait for Telegram user to load
    if (!tgUser && !user.isLoggedIn) return;

    // Avoid multiple sockets
    if (socket) return;

    const queryData = {
      userId: user.userId || randomName,
      isLoggedIn: user.isLoggedIn,
      device: "telegram",
      is_telegram_login: true,
      registration_data: "registration",
      telegram_data: JSON.stringify({
        telegram_id: tgUser?.id?.toString() || "",
        telegram_language: tgUser?.language_code || "",
        telegram_username: tgUser?.username || "",
        telegram_first_name: tgUser?.first_name || "",
        telegram_last_name: tgUser?.last_name || "",
        telegram_photo_url: tgUser?.photo_url || "",
      })
    };

    const newSocket = io(serverUrl, { query: queryData });

    newSocket.on("connect", () => {
      console.log("Connected to Socket.io");
      console.log("Socket Id", newSocket.id);

      dispatch(login({
        userId: user.isLoggedIn ? user.userId : randomName,
        socketId: newSocket.id || "",
      }));

      dispatch(login_telegram({
        first_name: initDataState?.user?.first_name || "",
        last_name: initDataState?.user?.last_name || "",
        username: initDataState?.user?.username || "",
        photo_url: initDataState?.user?.photo_url || "",
        telegram_id: initDataState?.user?.id?.toString() || "",
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Disconnected From Socket.io");
    };

  }, []);

  return (
    <SocketContext.Provider
      value={socket}>
      {children}
    </SocketContext.Provider>
  );
}