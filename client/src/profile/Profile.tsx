import Page from '../app/Page';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { H3, Label, Classes, Button, Intent, Overlay, Spinner } from '@blueprintjs/core';
import './Profile.css';
import cn from 'classnames';
import { ProfileModel } from '../model';
import ServicesContext from '../services/servicesContext';
import Validatable from '../common/Validatable';

type ValidatonErrors = Partial<Record<keyof ProfileModel, string>>;

const Profile: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const services = useContext(ServicesContext);
  const [profile, setProfile] = useState({} as ProfileModel);
  useEffect(() => {
    services.apiClient.getProfile().then(data => setProfile(prev => ({ ...prev, ...data })));
  }, []);

  const set = useCallback((field: keyof ProfileModel, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const save = useCallback(() => {
    setErrors({});
    setIsSaving(true);
    services.apiClient.saveProfile(profile).then(status => {
      setIsSaving(false);

      if (status.Errors) {
        setErrors(status.Errors);
      } else {
        services.toaster.show({
          message: status.Success,
          intent: Intent.SUCCESS
        });
      }
    });
  }, [profile, services]);

  return (
    <Page>
      <Overlay isOpen={isSaving} className="loading-overlay">
        <Spinner intent={Intent.PRIMARY} className="loading-overlay__spinner" />
      </Overlay>
      <div className="story-fields">
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Имя</span>
          <Validatable error={errors.Username}>
            <input
              type="text"
              value={profile.Username}
              onChange={evt => set('Username', evt.target.value)}
              className={cn(Classes.INPUT, 'story-field__editor')}
              placeholder="Ваше имя"
            />
          </Validatable>
        </Label>
        <H3>Мои контакты</H3>
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Емейл</span>
          <Validatable error={errors.Email}>
            <input
              type="text"
              value={profile.Email}
              onChange={evt => set('Email', evt.target.value)}
              className={cn(Classes.INPUT, 'story-field__editor')}
              placeholder="Емейл"
            />
          </Validatable>
        </Label>
        <Label className="bp3-inline story-field story-field--inline">
          <span className="story-field__label-text">Телефон</span>
          <Validatable error={errors.Phone}>
            <input
              type="text"
              value={profile.Phone}
              onChange={evt => set('Phone', evt.target.value)}
              className={cn(Classes.INPUT, 'story-field__editor')}
              placeholder="Телефон"
            />
          </Validatable>
        </Label>

        <Button intent={Intent.PRIMARY} onClick={save}>
          Сохранить
        </Button>
      </div>
    </Page>
  );
};

export default Profile;
