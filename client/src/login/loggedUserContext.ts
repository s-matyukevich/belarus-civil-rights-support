import { User } from '../model';
import React from 'react';

type LoggedUserContextPayload = {
  loggedUser: User | null;
  setLoggedUser: (user: User) => void;
  logout: () => void;
};

const LoggedUserContext = React.createContext<LoggedUserContextPayload>({
  loggedUser: null,
  setLoggedUser: () => {
    throw new Error('Cannot set logged user - no provider found for the context');
  },
  logout: () => {
    throw new Error('Cannot logout user - no provider found for the context');
  }
});

export default LoggedUserContext;
