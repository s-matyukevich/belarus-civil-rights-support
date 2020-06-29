import Page from '../app/Page';
import React from 'react';
import { H3, Label, Classes, HTMLSelect, Button } from '@blueprintjs/core';
import './AddStory.css';
import cn from 'classnames';
import { Intent } from '@blueprintjs/core/lib/esm/common/intent';
import { useReferenceDataSelectors } from '../common/hooks';

const AddStory: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();

  return (
    <Page>
      <H3>Новая история</H3>
      <div className="story-fields">
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Ссылка на Youtube видеo</span>
          <input
            type="text"
            className={cn(Classes.INPUT, 'story-field__editor')}
            placeholder="https://www.youtube.com/watch?v=XyNlqQId-nk"
          />
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Название</span>
          <input
            type="text"
            className={cn(Classes.INPUT, 'story-field__editor')}
            placeholder="Название для вашей истории"
          />
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Описание</span>
          <textarea className={cn(Classes.INPUT, 'story-field__editor')} />
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Как мне можно помочь</span>
          <textarea className={cn(Classes.INPUT, 'story-field__editor')} />
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Город</span>
          <HTMLSelect className="story-field__editor" options={cities} />
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Категория</span>
          <HTMLSelect className="story-field__editor" options={categories} />
        </Label>

        <Button intent={Intent.PRIMARY}>Опубликовать историю</Button>
      </div>
    </Page>
  );
};

export default AddStory;
