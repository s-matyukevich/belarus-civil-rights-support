import { H3, HTMLSelect, Label } from '@blueprintjs/core';
import React from 'react';
import './Stories.css';
import { useReferenceDataSelectors } from '../common/hooks';

const sortOrders = ['Популярности', 'Дате'];

const StoriesFilter: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();

  return (
    <div className="stories-filter-container">
      <H3>Истории:</H3>

      <Label className="bp3-inline">
        Город
        <HTMLSelect options={cities} className="bp3-inline" />
      </Label>

      <Label className="bp3-inline">
        Категория
        <HTMLSelect options={categories} className="bp3-inline" />
      </Label>

      <Label className="bp3-inline">
        Сортировать по
        <HTMLSelect options={sortOrders} className="bp3-inline" />
      </Label>
    </div>
  );
};

export default StoriesFilter;
