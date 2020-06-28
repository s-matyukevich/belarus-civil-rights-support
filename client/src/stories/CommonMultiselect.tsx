import { MenuItem, Button } from '@blueprintjs/core';
import { MultiSelect, IItemRendererProps } from '@blueprintjs/select';
import React, { useState } from 'react';
import { Selectable } from '../common/hooks';

const CommonMultiselect: React.FC<{ items: Selectable[] }> = ({ items }) => {
  const CommonSelect = MultiSelect.ofType<Selectable>();
  const [selectedItems, setSelectedItems] = useState<Selectable[]>([]);
  const clearButton = items.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear} /> : undefined;

  function handleClear() {
    setSelectedItems([]);
  }

  function getSelectedItemIndex(item: Selectable) {
    return selectedItems.indexOf(item);
  }

  function selectItem(item: Selectable) {
    selectedItems.push(item);
    setSelectedItems(selectedItems);
  }

  function deselectItem(index: number) {
    setSelectedItems(selectedItems.filter((_item, i) => i !== index));
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

  function renderItem(item: Selectable, { modifiers, handleClick }: IItemRendererProps) {
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

  return (
    <CommonSelect
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
      className="bp3-inline"
    />
  );
};

export default CommonMultiselect;
