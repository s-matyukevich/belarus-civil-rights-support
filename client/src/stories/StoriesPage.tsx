import StoriesFilter from './StoriesFilter';
import React from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';
import { AddStoryButton } from '../app/Header';

export default () => (
  <Page headerContent={<AddStoryButton />}>
    <StoriesFilter />
    <StoriesList />
  </Page>
);
