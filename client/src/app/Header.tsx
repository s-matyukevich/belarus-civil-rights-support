import { Alignment, Icon, Navbar, Classes } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

export const AddStoryButton: React.FC = () => (
  <Link className={cn(Classes.BUTTON, Classes.INTENT_PRIMARY)} to="/add-story">
    Добавить свою историю
  </Link>
);

const Header: React.FC = ({ children }) => (
  <Navbar className="header">
    <Navbar.Group>
      <Navbar.Heading>
        <Link to="/">Dapamozham.by</Link>
      </Navbar.Heading>
    </Navbar.Group>

    <Navbar.Group align={Alignment.RIGHT}>
      {children ? (
        <>
          {children}
          <Navbar.Divider />
        </>
      ) : null}

      <Icon icon="user" />
    </Navbar.Group>
  </Navbar>
);

export default Header;
