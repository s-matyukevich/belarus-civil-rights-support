import React from 'react';
import './App.css';
import AddStory from '../addStory/AddStory';
import { HashRouter, Switch, Route } from 'react-router-dom';
import StoriesPage from '../stories/StoriesPage';

const App: React.FC = () => (
  <div className="app">
    <HashRouter>
      <Switch>
        <Route path="/add-story" component={AddStory} />
        <Route path="/" component={StoriesPage} />
      </Switch>
    </HashRouter>
  </div>
);

export default App;
