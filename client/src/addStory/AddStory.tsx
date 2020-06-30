import Page from '../app/Page';
import React, { useState, useCallback, useContext } from 'react';
import { H3, Label, Classes, HTMLSelect, Button } from '@blueprintjs/core';
import './AddStory.css';
import cn from 'classnames';
import { Intent } from '@blueprintjs/core/lib/esm/common/intent';
import { useReferenceDataSelectors } from '../common/hooks';
import { AddStoryModel } from '../model';
import CommonMultiselect from '../stories/CommonMultiselect';
import ServicesContext from '../services/servicesContext';

const newStory: AddStoryModel = {
  ID: 0,
  Title: '',
  Categories: [],
  Description: '',
  HelpInstructions: '',
  VideoUrl: '',
  CityID: 0
};

const AddStory: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();
  const [story, setStory] = useState(newStory);
  const services = useContext(ServicesContext);

  const set = useCallback((field: keyof AddStoryModel, value: any) => {
    setStory(previousStory => ({ ...previousStory, [field]: value }));
  }, []);

  const publish = useCallback(() => {
    services.apiClient.addStory(story);
  }, [story, services]);

  return (
    <Page>
      <H3>Новая история</H3>
      <div className="story-fields">
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Ссылка на Youtube видеo</span>
          <input
            type="text"
            value={story.VideoUrl}
            className={cn(Classes.INPUT, 'story-field__editor')}
            onChange={evt => set('VideoUrl', evt.target.value)}
            placeholder="https://www.youtube.com/watch?v=XyNlqQId-nk"
          />
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Название</span>
          <input
            type="text"
            value={story.Title}
            onChange={evt => set('Title', evt.target.value)}
            className={cn(Classes.INPUT, 'story-field__editor')}
            placeholder="Название для вашей истории"
          />
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Описание</span>
          <textarea
            className={cn(Classes.INPUT, 'story-field__editor')}
            value={story.Description}
            onChange={evt => set('Description', evt.target.value)}
          />
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Как мне можно помочь</span>
          <textarea
            className={cn(Classes.INPUT, 'story-field__editor')}
            value={story.HelpInstructions}
            onChange={evt => set('HelpInstructions', evt.target.value)}
          />
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Город</span>
          <HTMLSelect
            className="story-field__editor"
            options={cities}
            value={story.CityID}
            onChange={evt => set('CityID', parseInt(evt.target.value, 10))}
          />
        </Label>

        <Label className="bp3-inline story-field story-field--inline" onClick={evt => evt.preventDefault()}>
          <span className="story-field__label-text">Категория</span>
          <CommonMultiselect
            items={categories}
            type="multi"
            placeholder="Категория"
            className="story-field__editor"
            onChange={selected =>
              set(
                'Categories',
                selected.map(item => (typeof item.value === 'string' ? parseInt(item.value, 10) : item.value))
              )
            }
          />
        </Label>

        <Button intent={Intent.PRIMARY} onClick={publish}>
          Опубликовать историю
        </Button>
      </div>
    </Page>
  );
};

export default AddStory;
