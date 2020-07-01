import StoriesFilter from './StoriesFilter';
import React, { useContext, useState } from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';
import { AddStoryButton } from '../app/Header';
import { Filters } from '../model';
import ServicesContext from '../services/servicesContext';
import { usePromise } from '../common/hooks';

const Stories: React.FC = () => {
  const services = useContext(ServicesContext);
  const [filters] = useState<Filters>({} as Filters);
  const [, stories] = usePromise(() => services.apiClient.getStories(filters), []);

  return (
    <Page headerContent={<AddStoryButton />}>
      <StoriesFilter />
      <StoriesList stories={stories} />
    </Page>
  );
};

export default Stories;
