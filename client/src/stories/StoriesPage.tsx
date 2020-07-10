import StoriesFilter from './StoriesFilter';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import StoriesList from './StoriesList';
import Page from '../app/Page';
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

  const updateStories = useCallback(
    (f: Filters, clearStories: boolean, currentStories: Story[]) => {
      setFilters(f);
      services.apiClient.getStories(f).then(remoteStories => {
        if (!remoteStories) {
          setReachedBottom(true);
        }
        if (clearStories) {
          setStories(remoteStories);
        } else {
          if (remoteStories) {
            setStories([...currentStories, ...remoteStories]);
          }
        }
      });
    },
    [services]
  );

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
    updateStories(emptyFilters, true, []);
  }, [updateStories]);

  return (
    <Page>
      <StoriesFilter
        filters={filters}
        onChange={f => {
          f.Page = 0;
          setReachedBottom(false);
          updateStories(f, true, stories);
        }}
      />
      <StoriesList
        stories={stories}
        onScroll={() => {
          if (!stories.length || reachedBottom) {
            return;
          }
          filters.Page++;
          updateStories(filters, false, stories);
        }}
      />
    </Page>
  );
};

export default Stories;
