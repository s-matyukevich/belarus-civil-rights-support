import { Alignment, Button, Icon, Intent, Navbar } from '@blueprintjs/core';
import React from 'react';

export default () => (
  <Navbar className="header">
    <Navbar.Group>
      <Navbar.Heading>Dapamaji.by</Navbar.Heading>
    </Navbar.Group>
    <Navbar.Group align={Alignment.RIGHT}>
      <Button intent={Intent.PRIMARY}>Добавить свою историю</Button>
      <Navbar.Divider />
      <Icon icon="user" />
    </Navbar.Group>
  </Navbar>
);
