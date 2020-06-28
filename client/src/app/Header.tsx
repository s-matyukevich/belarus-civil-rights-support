import { Alignment, Navbar, Classes, Button, Intent, Popover, Menu } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React, { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import LoggedUserContext from '../services/loggedUserContext';

export const AddStoryButton: React.FC = () => (
  <Link className={cn(Classes.BUTTON, Classes.INTENT_PRIMARY)} to="/add-story">
    Добавить свою историю
  </Link>
);

const Header: React.FC = ({ children }) => {
  const { loggedUser, setLoggedUser, logout } = useContext(LoggedUserContext);

  const login = useCallback(() => {
    setLoggedUser({
      id: 1,
      imageUrl: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal',
      name: 'Тестовый пользователь'
    });
  }, []);

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
    <Button intent={Intent.PRIMARY} onClick={login}>
      Войти
    </Button>
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
