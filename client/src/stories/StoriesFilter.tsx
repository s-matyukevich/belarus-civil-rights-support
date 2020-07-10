import React, { useCallback } from 'react';
import './Stories.scss';
import { useReferenceDataSelectors, Selectable } from '../common/hooks';
import { Filters } from '../model';
import CommonMultiselect from '../common/CommonMultiselect';
import { InputGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

const sortOrders: Selectable[] = [
  { label: 'По популярности', value: 0 },
  { label: 'По дате', value: 1 }
];
const sortColumns = ['rating', 'created_at'];
const sortDirections = ['DESC', 'DESC'];

let lastSearchVal = '';

const StoriesFilter: React.FC<{
  filters: Filters;
  onChange: (filters: Filters) => void;
}> = ({ filters, onChange }) => {
  const { cities, categories } = useReferenceDataSelectors();

  const set = useCallback((field: keyof Filters, value: any) => {
    filters = { ...filters, [field]: value };
    onChange(filters);
  }, []);

  return (
    <div className="stories-filter">
      <InputGroup
        type="search"
        leftIcon={IconNames.SEARCH}
        className="stories-filter__attribute stories-filter__search"
        placeholder="Поиск"
        onChange={(evt: any) => {
          // TODO: rewrite this, I don't understand how exactly variable are set/initialized here;
          lastSearchVal = evt.target.value;
          setTimeout(() => {
            if (lastSearchVal !== filters.Search) {
              set('Search', lastSearchVal);
              filters.Search = lastSearchVal;
            }
          }, 500);
        }}
      ></InputGroup>

      <div className="stories-filter__other-criteria">
        <CommonMultiselect
          items={cities}
          type={'multi'}
          placeholder="Город"
          className="stories-filter__attribute"
          onChange={selected =>
            set(
              'Cities',
              selected.map(item => item.value)
            )
          }
        />

        <CommonMultiselect
          items={categories}
          type={'multi'}
          placeholder="Категория"
          className="stories-filter__attribute"
          onChange={selected =>
            set(
              'Categories',
              selected.map(item => item.value)
            )
          }
        />

        <CommonMultiselect
          items={sortOrders}
          type="suggest"
          placeholder="Сортировать"
          className="stories-filter__attribute"
          onChange={items => {
            if (items.length > 0) {
              onChange({
                ...filters,
                SortColumn: sortColumns[items[0].value],
                SortDirection: sortDirections[items[0].value]
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default StoriesFilter;
