import React, { useCallback, useState } from 'react';
import { User } from '../model';
import LoggedUserContext from '../services/loggedUserContext';

const LoggedUserProvider: React.FC = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const logout = useCallback(() => setLoggedUser(null), []);

  return (
    <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser, logout }}>{children}</LoggedUserContext.Provider>
  );
};

export default LoggedUserProvider;
