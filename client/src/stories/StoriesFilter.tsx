import { ControlGroup } from '@blueprintjs/core';
import React, { useCallback } from 'react';
import './Stories.css';
import { useReferenceDataSelectors, Selectable } from '../common/hooks';
import { Filters } from '../model';
import CommonMultiselect from '../common/CommonMultiselect';

const sortOrders: Selectable[] = [
  { label: 'По популярности', value: 0 },
  { label: 'По дате', value: 1 }
];
const sortColumns = ['rating', 'created_at'];
const sortDirections = ['DESC', 'DESC'];

const StoriesFilter: React.FC<{
  filters: Filters;
  onChange: (filters: Filters) => void;
}> = ({ filters, onChange }) => {
  const { cities, categories } = useReferenceDataSelectors();

  const set = useCallback((field: keyof Filters, value: any) => {
    filters = { ...filters, [field]: value };
    onChange(filters);
  }, []);

  let lastSearchVal = '';

  return (
    <div className="stories-filter-container">
      <ControlGroup fill={true} vertical={false}>
        <div className="bp3-input-group .search">
          <span className="bp3-icon bp3-icon-search"></span>
          <input
            className="bp3-input"
            type="search"
            placeholder="Поиск"
            dir="auto"
            onChange={evt => {
              lastSearchVal = evt.target.value;
              setTimeout(() => {
                if (lastSearchVal != filters.Search) {
                  filters.Search = lastSearchVal;
                  onChange(filters);
                }
              }, 1000);
            }}
          />
        </div>
      </ControlGroup>
      <ControlGroup fill={true} vertical={false}>
        <CommonMultiselect
          items={cities}
          type={'multi'}
          placeholder="Город"
          className="bp3-inline"
          onChange={selected =>
            set(
              'Cities',
              selected.map(item => item.value)
            )
          }
        />
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <CommonMultiselect
          items={categories}
          type={'multi'}
          placeholder="Категория"
          className="bp3-inline"
          onChange={selected =>
            set(
              'Categories',
              selected.map(item => item.value)
            )
          }
        />
      </ControlGroup>

      <ControlGroup fill={true} vertical={false}>
        <CommonMultiselect
          items={sortOrders}
          type="suggest"
          placeholder="Сортировать"
          className="story-field__editor story-field__editor--multiselect"
          onChange={items => {
            if (items.length > 0) {
              filters.SortColumn = sortColumns[items[0].value];
              filters.SortDirection = sortDirections[items[0].value];
              onChange(filters);
            }
          }}
        />
      </ControlGroup>
    </div>
  );
};

export default StoriesFilter;
