import { MenuItem, Button } from '@blueprintjs/core';
import { MultiSelect, IItemRendererProps } from '@blueprintjs/select';
import React, { useState, useCallback } from 'react';
import { Selectable } from '../common/hooks';

const CommonMultiselect: React.FC<{
  items: Selectable[];
  type: string;
  placeholder: string;
  className?: string;
  onChange?: (selectedItems: Selectable[]) => void;
}> = ({ items, type, placeholder, className, onChange }) => {
  const CustomMultiSelect = MultiSelect.ofType<Selectable>();
  // const CustomSuggest = Suggest.ofType<Selectable>(); //We are going to need this functionality to filter cities on the create story page
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

  function handleItemSelect(item: Selectable) {
    if (isItemSelected(item)) {
      deselectItem(getSelectedItemIndex(item));
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
  }

  return null;
};

export default CommonMultiselect;
