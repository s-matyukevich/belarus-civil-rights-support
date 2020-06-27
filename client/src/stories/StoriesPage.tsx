import StoriesFilter from './StoriesFilter';
import React from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';

export default () => (
  <Page>
    <StoriesFilter />
    <StoriesList />
  </Page>
);
