import {
  createContext,
  useMemo,
  useState,
} from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      globalLoading,
      setGlobalLoading,
      notification,
      showNotification,
    }),
    [
      sidebarOpen,
      globalLoading,
      notification,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}