import { useEffect } from "react";

// Socket
import { SocketProvider } from "@/context/SocketProvider";

// State
import { Provider as ReduxProvider } from 'react-redux';
import { persistor, store } from "./store";
import { PersistGate } from 'redux-persist/integration/react';

// Firebase
import { analytics, firebase } from "@/utils/firebase";

export default function Provider({ children }: { children: React.ReactNode }) {
  const url = import.meta.env.VITE_SERVER_URL;


  // Initialize Firebase
  const InitializeFirebase = () => {
    try {
      console.log(firebase);
      console.log(analytics);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    InitializeFirebase();
  }, []);

  return (
    <ReduxProvider
      store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <SocketProvider
          serverUrl={`${url}/user`}>
          {children}
        </SocketProvider>
      </PersistGate>
    </ReduxProvider>
  )
}
