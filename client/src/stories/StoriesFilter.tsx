import { HTMLSelect, Label, ControlGroup } from '@blueprintjs/core';
import CommonMultiSelect from './CommonMultiselect';
import React from 'react';
import './Stories.css';
import { useReferenceDataSelectors } from '../common/hooks';

const sortOrders = ['По популярности', 'По дате'];

const StoriesFilter: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();

  return (
    <div className="stories-filter-container">
      
      <ControlGroup fill={true} vertical={false}>
        <div className="bp3-input-group .search">
          <span className="bp3-icon bp3-icon-search"></span>
          <input className="bp3-input" type="search" placeholder="Поиск" dir="auto" />
        </div>
      </ControlGroup>
      <ControlGroup fill={true} vertical={false}>
        <CommonMultiSelect items={cities} type={"multi"} placeholder="Город"/>
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <CommonMultiSelect items={categories} type={"multi"} placeholder="Категория"/>
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <Label className="bp3-inline">Сортировать </Label>
        <HTMLSelect options={sortOrders} className="bp3-inline" />
      </ControlGroup>
    </div>
  );
};

export default StoriesFilter;
