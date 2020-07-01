import StoriesFilter from './StoriesFilter';
import React, { useContext, useState, useEffect } from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';
import { AddStoryButton } from '../app/Header';
import { Filters, Story } from '../model';
import ServicesContext from '../services/servicesContext';

const Stories: React.FC = () => {
  const services = useContext(ServicesContext);
  const [filters, setFilters] = useState<Filters>({} as Filters);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    services.apiClient.getStories(filters).then(remoteStories => setStories(remoteStories));
  }, []);

  return (
    <Page headerContent={<AddStoryButton />}>
      <StoriesFilter
        filters={filters}
        onChange={f => {
          setFilters(f);
          services.apiClient.getStories(f).then(remoteStories => setStories(remoteStories));
        }}
      />
      <StoriesList stories={stories} />
    </Page>
  );
};

export default Stories;
