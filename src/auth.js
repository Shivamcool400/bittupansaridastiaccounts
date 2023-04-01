import React, { createContext, useContext, useState } from 'react';



const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  
  return (
    <userAuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        setUser
      }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}