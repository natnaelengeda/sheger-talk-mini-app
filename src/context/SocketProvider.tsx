import { generateRandomName } from "@/utils/randomNameGenerator";
import
React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io, Socket } from "socket.io-client";

// Axios
import { useDispatch, useSelector } from "react-redux";
import { login, UserState } from "@/state/user";

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

  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useSelector((state: { user: UserState }) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const newSocket = io(serverUrl, {
      query: {
        userId: user.isLoggedIn ? user.userId : randomName,
        isLoggedIn: user.isLoggedIn,
        device: "web",
      }
    });

    newSocket.on("connect", () => {
      console.log("Connected to Socket.io");
      console.log("Socket Id", newSocket.id);

      dispatch(login({
        userId: user.isLoggedIn ? user.userId : randomName,
        socketId: newSocket.id || "",
        isLoggedIn: user.isLoggedIn,
        language: "en",
        theme: "light"
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