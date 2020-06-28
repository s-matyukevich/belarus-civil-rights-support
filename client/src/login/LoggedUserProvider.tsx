import React, { useCallback, useContext, useEffect, useState } from 'react';
import { User } from '../model';
import LoggedUserContext from './loggedUserContext';
import ServicesContext from '../services/servicesContext';

const LoggedUserProvider: React.FC = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const services = useContext(ServicesContext);
  const logout = useCallback(() => {
    setLoggedUser(null);
    services.apiClient.logout();
  }, [services]);

  useEffect(() => {
    services.apiClient.getLoggedUser().then(setLoggedUser);
  }, [services]);

  return (
    <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser, logout }}>{children}</LoggedUserContext.Provider>
  );
};

export default LoggedUserProvider;
