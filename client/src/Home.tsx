import Header from './Header';
import StoriesFilter from './stories/StoriesFilter';
import React from 'react';
import StoriesList from './stories/StoriesList';

export default () => (
  <div className="page">
    <Header />
    <div className="page-content">
      <StoriesFilter />
      <StoriesList />
    </div>
  </div>
);
