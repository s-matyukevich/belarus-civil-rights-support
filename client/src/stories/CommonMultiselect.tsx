import { MenuItem, Button } from '@blueprintjs/core';
import { MultiSelect, Suggest, IItemRendererProps } from '@blueprintjs/select';
import React, { useState, useCallback, useEffect } from 'react';
import { Selectable } from '../common/hooks';

const CommonMultiselect: React.FC<{
  items: Selectable[];
  type: string;
  placeholder: string;
  className?: string;
  selectedIds?: number[];
  onChange?: (selectedItems: Selectable[]) => void;
}> = ({ items, type, placeholder, className, selectedIds, onChange }) => {
  const CustomMultiSelect = MultiSelect.ofType<Selectable>();
  const CustomSuggest = Suggest.ofType<Selectable>();
  const [selectedItems, setSelectedItems] = useState<Selectable[]>([]);
  const clearButton = items.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear} /> : undefined;

  const updateSelectedItems = useCallback(
    (currentlySelected: Selectable[]) => {
      if (onChange) {
        onChange(currentlySelected);
      }
      setSelectedItems(currentlySelected);
    },
    [onChange]
  );

  function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
  }

  useEffect(() => {
    if (!selectedIds) {
      return;
    }
    setSelectedItems(_ => {
      return selectedIds.map(id => items.find(element => element.value === id)).filter(notUndefined);
    });
  }, [selectedIds]);

  function handleClear() {
    updateSelectedItems([]);
  }

  function getSelectedItemIndex(item: Selectable) {
    return selectedItems.indexOf(item);
  }

  function selectItem(item: Selectable) {
    updateSelectedItems([...selectedItems, item]);
  }

  function deselectItem(index: number) {
    updateSelectedItems(selectedItems.filter((_item, i) => i !== index));
  }

  function deselectItemWithoutTriggeringOnChange(index: number) {
    setSelectedItems(selectedItems.filter((_item, i) => i !== index));
  }

  function handleItemSelect(item: Selectable) {
    if (isItemSelected(item)) {
      deselectItem(getSelectedItemIndex(item));
    } else {
      selectItem(item);
    }
  }

  function handleSingleItemSelect(item: Selectable) {
    if (isItemSelected(item)) {
      deselectItem(getSelectedItemIndex(item));
    } else if (selectedItems.length > 0) {
      selectedItems[0] = item;
      updateSelectedItems(selectedItems);
    } else {
      selectItem(item);
    }
  }

  function isItemSelected(item: Selectable) {
    return selectedItems.indexOf(item) > -1;
  }

  function handleTagRemove(value: string, index: number) {
    deselectItem(index);
  }

  function itemPredicate(query: string, item: Selectable) {
    return item.label.toLowerCase().includes(query.toLowerCase());
  }

  function renderItem(item: Selectable, { modifiers, handleClick }: IItemRendererProps) {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={isItemSelected(item) ? 'tick' : 'blank'}
        key={item.value}
        onClick={handleClick}
        text={item.label}
        shouldDismissPopover={false}
      />
    );
  }

  if (type === 'multi') {
    return (
      <CustomMultiSelect
        items={items}
        selectedItems={selectedItems}
        popoverProps={{ minimal: true }}
        tagRenderer={(item: Selectable) => item.label}
        itemRenderer={renderItem}
        tagInputProps={{
          onRemove: handleTagRemove,
          rightElement: clearButton
        }}
        onItemSelect={handleItemSelect}
        itemPredicate={itemPredicate}
        placeholder={placeholder}
        resetOnSelect={true}
        className={className}
      />
    );
  } else if (type === 'suggest') {
    return (
      <CustomSuggest
        inputValueRenderer={(item: Selectable) => item.label}
        items={items}
        className={className}
        itemRenderer={renderItem}
        onItemSelect={handleSingleItemSelect}
        itemPredicate={itemPredicate}
        popoverProps={{ minimal: true }}
        selectedItem={selectedItems.length > 0 ? selectedItems[0] : null}
      />
    );
  }

  return null;
};

export default CommonMultiselect;
