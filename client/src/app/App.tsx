import React from 'react';
import './App.css';
import AddStory from '../addStory/AddStory';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import StoriesPage from '../stories/StoriesPage';
import LoggedUserProvider from '../login/LoggedUserProvider';
import StoryPage from '../storyDetails/StoryPage';
import Profile from '../profile/Profile';
import MyStories from '../myStories/MyStories';
import PrivacyPolicy from '../privacy/PrivacyPolicy';
import ViewportProvider from '../responsiveness/ViewportProvider';

const App: React.FC = () => (
  <div className="app">
    <LoggedUserProvider>
      <ViewportProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/add-story" component={AddStory} />
            <Route path="/edit-story/:id" component={AddStory} />
            <Route path="/story/:id" component={StoryPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/my-stories" component={MyStories} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/" component={StoriesPage} />
          </Switch>
        </BrowserRouter>
      </ViewportProvider>
    </LoggedUserProvider>
  </div>
);

export default App;
