import StoriesFilter from './StoriesFilter';
import React, { useContext, useState, useEffect } from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';
import { AddStoryButton } from '../app/Header';
import { Filters, Story } from '../model';
import ServicesContext from '../services/servicesContext';

const newFilter: Filters = {
  Page: 0,
  Search: '',
  Categories: [],
  Cities: [],
  SortColumn: '',
  SortDirection: ''
};

const Stories: React.FC = () => {
  const services = useContext(ServicesContext);
  const [filters, setFilters] = useState<Filters>(newFilter);
  const [stories, setStories] = useState<Story[]>([]);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const updateStories = (f: Filters, clearStories: boolean) => {
    services.apiClient.getStories(f).then(remoteStories => {
      if (!remoteStories) {
        setReachedBottom(true);
      }
      if (clearStories) {
        setStories(remoteStories);
      } else {
        if (remoteStories) {
          setStories([...stories, ...remoteStories]);
        }
      }
    });
  };

  useEffect(() => {
    const emptyFilters = {
      Page: 0,
      Search: '',
      Categories: [],
      Cities: [],
      SortColumn: '',
      SortDirection: ''
    };
    setFilters(emptyFilters);
    updateStories(emptyFilters, true);
  }, []);

  return (
    <Page headerContent={<AddStoryButton />}>
      <StoriesFilter
        filters={filters}
        onChange={f => {
          f.Page = 0;
          setReachedBottom(false);
          setFilters(f);
          updateStories(f, true);
        }}
      />
      <StoriesList
        stories={stories}
        onScroll={() => {
          if (!stories.length || reachedBottom) {
            return;
          }
          filters.Page++;
          setFilters(filters);
          updateStories(filters, false);
        }}
      />
    </Page>
  );
};

export default Stories;
