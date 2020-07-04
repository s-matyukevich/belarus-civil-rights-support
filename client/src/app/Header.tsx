import { Alignment, Classes, Menu, Navbar, Popover, ButtonGroup, Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoggedUserContext from '../login/loggedUserContext';
import { LoginButton } from '../login/LoginButton';
import SocialGroups from '../common/SocialGroups';

export const AddStoryButton: React.FC = () => {
  const history = useHistory();
  return (
    <ButtonGroup minimal={false}>
      <Popover
        content={
          <SocialGroups
            className="contact-menu-header"
            header="Наши контакты"
            text="Для того чтобы связаться с нами Вы можете воспользоваться одной из наших груп в социальных сетях"
          ></SocialGroups>
        }
      >
        <Button rightIcon="caret-down">Связаться с нами</Button>
      </Popover>
      <Button className={Classes.BUTTON} intent={Intent.PRIMARY} onClick={() => history.push('/add-story')}>
        Добавить свою историю
      </Button>
    </ButtonGroup>
  );
};

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
      <AddStoryButton />
      <Navbar.Divider />
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
