import Page from '../app/Page';
import React, { useState, useCallback, useContext } from 'react';
import {
  H3,
  Label,
  Classes,
  HTMLSelect,
  Button,
  Tooltip,
  Intent,
  Position,
  setHotkeysDialogProps,
  Overlay,
  Spinner
} from '@blueprintjs/core';
import './AddStory.css';
import cn from 'classnames';
import { useReferenceDataSelectors } from '../common/hooks';
import { AddStoryModel } from '../model';
import CommonMultiselect from '../stories/CommonMultiselect';
import ServicesContext from '../services/servicesContext';
import { useHistory } from 'react-router-dom';

const newStory: AddStoryModel = {
  ID: 0,
  Title: '',
  Categories: [],
  Description: '',
  HelpInstructions: '',
  VideoUrl: '',
  CityID: 0
};

const Validatable: React.FC<{ error?: string }> = ({ error, children }) => {
  return error ? (
    <Tooltip content={error} position={Position.RIGHT} intent={Intent.DANGER} isOpen={true}>
      {children}
    </Tooltip>
  ) : (
    (children as any)
  );
};

type ValidatonErrors = Partial<Record<keyof AddStoryModel, string>>;

const AddStory: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();
  const [isSaving, setIsSaving] = useState(false);
  const [story, setStory] = useState(newStory);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const services = useContext(ServicesContext);
  const history = useHistory();

  const set = useCallback((field: keyof AddStoryModel, value: any) => {
    setStory(previousStory => ({ ...previousStory, [field]: value }));
    setErrors(previousErrors => ({ ...previousErrors, [field]: undefined }));
  }, []);

  const publish = useCallback(() => {
    setErrors({});
    setIsSaving(true);
    services.apiClient.addStory(story).then(status => {
      setIsSaving(false);

      if (status.Errors) {
        setErrors(status.Errors);
      } else {
        services.toaster.show({
          message: status.Success,
          intent: Intent.SUCCESS
        });

        // Probably we should navigate user to the page of the newly created story
        // but we don't have it yet, so redirect him back to the main page
        history.replace('/');
      }
    });
  }, [story, services]);

  return (
    <Page>
      <Overlay isOpen={isSaving} className="loading-overlay">
        <Spinner intent={Intent.PRIMARY} className="loading-overlay__spinner" />
      </Overlay>
      <H3>Новая история</H3>
      <div className="story-fields">
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Ссылка на Youtube видеo</span>
          <Validatable error={errors.VideoUrl}>
            <input
              type="text"
              value={story.VideoUrl}
              className={cn(Classes.INPUT, 'story-field__editor')}
              onChange={evt => set('VideoUrl', evt.target.value)}
              placeholder="https://www.youtube.com/watch?v=XyNlqQId-nk"
            />
          </Validatable>
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Название</span>
          <Validatable error={errors.Title}>
            <input
              type="text"
              value={story.Title}
              onChange={evt => set('Title', evt.target.value)}
              className={cn(Classes.INPUT, 'story-field__editor')}
              placeholder="Название для вашей истории"
            />
          </Validatable>
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Описание</span>
          <Validatable error={errors.Description}>
            <textarea
              className={cn(Classes.INPUT, 'story-field__editor')}
              value={story.Description}
              onChange={evt => set('Description', evt.target.value)}
            />
          </Validatable>
        </Label>

        <Label className="story-field">
          <span className="story-field__label-text">Как мне можно помочь</span>
          <Validatable error={errors.HelpInstructions}>
            <textarea
              className={cn(Classes.INPUT, 'story-field__editor')}
              value={story.HelpInstructions}
              onChange={evt => set('HelpInstructions', evt.target.value)}
            />
          </Validatable>
        </Label>

        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Город</span>
          <Validatable error={errors.CityID}>
            <HTMLSelect
              className="story-field__editor"
              options={cities}
              value={story.CityID}
              onChange={evt => set('CityID', parseInt(evt.target.value, 10))}
            />
          </Validatable>
        </Label>

        <Label className="bp3-inline story-field story-field--inline" onClick={evt => evt.preventDefault()}>
          <span className="story-field__label-text">Категория</span>
          <Validatable error={errors.Categories}>
            <CommonMultiselect
              items={categories}
              type="multi"
              placeholder="Категория"
              className="story-field__editor story-field__editor--multiselect"
              onChange={selected =>
                set(
                  'Categories',
                  selected.map(item => (typeof item.value === 'string' ? parseInt(item.value, 10) : item.value))
                )
              }
            />
          </Validatable>
        </Label>

        <Button intent={Intent.PRIMARY} onClick={publish}>
          Опубликовать историю
        </Button>
      </div>
    </Page>
  );
};

export default AddStory;
