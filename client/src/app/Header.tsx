import { Alignment, Navbar, Classes, Button, Intent, Popover, Menu, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import LoggedUserContext from '../services/loggedUserContext';
import { LoginProvider } from '../model';
import ServicesContext from '../services/servicesContext';

export const AddStoryButton: React.FC = () => (
  <Link className={cn(Classes.BUTTON, Classes.INTENT_PRIMARY)} to="/add-story">
    Добавить свою историю
  </Link>
);

function loginViaProvider(provider: LoginProvider) {
  const loginUrl = new URL(provider.auth_url);
  loginUrl.searchParams.set('client_id', provider.client_id);
  loginUrl.searchParams.set('redirect_uri', provider.redirect_url);

  if (provider.scope) {
    loginUrl.searchParams.set('scope', provider.scope);
  }

  window.location.assign(loginUrl.href);
}

const LoginButton: React.FC = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [loginProviders, setLoginProviders] = useState<LoginProvider[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    if (dialogIsOpen && loginProviders.length === 0) {
      services.apiClient.getLoginProviders().then(setLoginProviders);
    }
  }, [dialogIsOpen, loginProviders, services]);

  return (
    <>
      <Button intent={Intent.PRIMARY} onClick={() => setDialogIsOpen(true)}>
        Войти
      </Button>
      <Dialog isOpen={dialogIsOpen} onClose={() => setDialogIsOpen(false)} title="Вход">
        <div className={Classes.DIALOG_BODY}>
          <p>Войдите через одну из социальных сетей, чтобы рассказать свою историю</p>
          {loginProviders.map(provider => (
            <div key={provider.name}>
              <Button onClick={() => loginViaProvider(provider)}>{provider.name}</Button>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};

const Header: React.FC = ({ children }) => {
  const { loggedUser, logout } = useContext(LoggedUserContext);

  const userContent = loggedUser ? (
    <>
      {children ? (
        <>
          {children}
          <Navbar.Divider />
        </>
      ) : null}

      <Popover
        content={
          <Menu>
            <Menu.Item text="Выйти" icon={IconNames.LOG_OUT} onClick={logout} />
          </Menu>
        }
      >
        <img src={loggedUser.imageUrl} alt={loggedUser.name} className="avatar" />
      </Popover>
    </>
  ) : (
    <LoginButton />
  );

  return (
    <Navbar className="header">
      <Navbar.Group>
        <Navbar.Heading>
          <Link to="/">Dapamozham.by</Link>
        </Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>{userContent}</Navbar.Group>
    </Navbar>
  );
};

export default Header;
