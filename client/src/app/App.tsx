import React from 'react';
import './App.css';
import AddStory from '../addStory/AddStory';
import { HashRouter, Switch, Route } from 'react-router-dom';
import StoriesPage from '../stories/StoriesPage';
import LoggedUserProvider from '../login/LoggedUserProvider';

const App: React.FC = () => (
  <div className="app">
    <LoggedUserProvider>
      <HashRouter>
        <Switch>
          <Route path="/add-story" component={AddStory} />
          <Route path="/edit-story/:id" component={AddStory} />
          <Route path="/" component={StoriesPage} />
        </Switch>
      </HashRouter>
    </LoggedUserProvider>
  </div>
);

export default App;
