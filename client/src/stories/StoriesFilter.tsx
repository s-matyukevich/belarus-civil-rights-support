import { HTMLSelect, Label, ControlGroup } from '@blueprintjs/core';
import CommonMultiSelect from './CommonMultiselect';
import React from 'react';
import './Stories.css';
import { useReferenceDataSelectors } from '../common/hooks';

const sortOrders = ['Популярности', 'Дате'];

const StoriesFilter: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();

  return (
    <div className="stories-filter-container">
      <ControlGroup fill={true} vertical={false}>
        <Label className="bp3-inline">Город</Label>
        <CommonMultiSelect items={cities} />
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <Label className="bp3-inline">Категория</Label>
        <CommonMultiSelect items={categories} />
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <Label className="bp3-inline">Сортировать по </Label>
        <HTMLSelect options={sortOrders} className="bp3-inline" />
      </ControlGroup>
    </div>
  );
};

export default StoriesFilter;
