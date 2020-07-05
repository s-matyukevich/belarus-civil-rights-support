import React from 'react';
import './App.css';
import AddStory from '../addStory/AddStory';
import { HashRouter, Switch, Route } from 'react-router-dom';
import StoriesPage from '../stories/StoriesPage';
import LoggedUserProvider from '../login/LoggedUserProvider';
import StoryPage from '../storyDetails/StoryPage';
import Profile from '../profile/Profile';
import MyStories from '../myStories/MyStories';
import ViewportProvider from '../responsiveness/ViewportProvider';

const App: React.FC = () => (
  <div className="app">
    <LoggedUserProvider>
      <ViewportProvider>
        <HashRouter>
          <Switch>
            <Route path="/add-story" component={AddStory} />
            <Route path="/edit-story/:id" component={AddStory} />
            <Route path="/story/:id" component={StoryPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/my-stories" component={MyStories} />
            <Route path="/" component={StoriesPage} />
          </Switch>
        </HashRouter>
      </ViewportProvider>
    </LoggedUserProvider>
  </div>
);

export default App;
