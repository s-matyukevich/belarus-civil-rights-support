import { Alignment, Classes, Menu, Navbar, Popover } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import LoggedUserContext from '../login/loggedUserContext';
import { LoginButton } from '../login/LoginButton';

export const AddStoryButton: React.FC = () => (
  <Link className={cn(Classes.BUTTON, Classes.INTENT_PRIMARY)} to="/add-story">
    Добавить свою историю
  </Link>
);

const Header: React.FC = ({ children }) => {
  const { loggedUser, logout } = useContext(LoggedUserContext);

  const history = useHistory();
  const openPage = useCallback((page: string) => history.push(page), []);

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
            <Menu.Item text="Профиль" icon={IconNames.SAVED} onClick={() => openPage('/profile')} />
            <Menu.Item text="Мои истории" icon={IconNames.LIST} onClick={() => openPage('/my-stories')} />
            <Menu.Item text="Выйти" icon={IconNames.LOG_OUT} onClick={logout} />
          </Menu>
        }
      >
        <img src={loggedUser.ImageURL} alt={loggedUser.Username} className="avatar" />
      </Popover>
    </>
  ) : (
    <LoginButton />
  );

  return (
    <Navbar className="header">
      <Navbar.Group>
        <Navbar.Heading>
          <Link to="/">
            <img src="/images/logo.png" height="100"></img>
          </Link>
        </Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>{userContent}</Navbar.Group>
    </Navbar>
  );
};

export default Header;
