import Page from '../app/Page';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  H3,
  Label,
  Classes,
  Button,
  Tooltip,
  Intent,
  Position,
  //  setHotkeysDialogProps,
  Overlay,
  Spinner
} from '@blueprintjs/core';
import './AddStory.css';
import cn from 'classnames';
import { useReferenceDataSelectors } from '../common/hooks';
import { StoryModel } from '../model';
import CommonMultiselect from '../common/CommonMultiselect';
import ServicesContext from '../services/servicesContext';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

const newStory: StoryModel = {
  ID: 0,
  Title: '',
  Categories: [],
  Description: '',
  HelpInstructions: '',
  VideoUrl: '',
  CityID: undefined
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

type ValidatonErrors = Partial<Record<keyof StoryModel, string>>;

const AddStory: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const services = useContext(ServicesContext);
  const history = useHistory();
  const { id } = useParams();
  const [story, setStory] = useState(newStory);
  useEffect(() => {
    services.apiClient.getStoryModel(id).then(remoteStory => setStory(prev => ({ ...prev, ...remoteStory })));
  }, []);

  const set = useCallback((field: keyof StoryModel, value: any) => {
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

        history.replace('/edit-story/' + status.ID);
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
            <CommonMultiselect
              items={cities}
              type="suggest"
              placeholder="Город"
              className="story-field__editor story-field__editor--multiselect"
              selectedIds={story.CityID ? [story.CityID] : []}
              onChange={selected => set('CityID', selected && selected.length > 0 ? selected[0].value : null)}
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
              selectedIds={story.Categories}
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
