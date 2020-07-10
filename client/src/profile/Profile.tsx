import Page from '../app/Page';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  H3,
  H2,
  Label,
  Classes,
  Button,
  Intent,
  Overlay,
  Spinner,
  ControlGroup,
  InputGroup,
  FormGroup
} from '@blueprintjs/core';
import './Profile.scss';
import cn from 'classnames';
import { ProfileModel } from '../model';
import ServicesContext from '../services/servicesContext';
import Validatable from '../common/Validatable';
import { useLayout, Layout } from '../responsiveness/viewportContext';

type ValidatonErrors = Partial<Record<keyof ProfileModel, string>>;

const newProfile: ProfileModel = {
  ID: 0,
  ImageURL: '',
  Email: '',
  Phone: '',
  Username: '',
  SocialLinks: []
};

const Profile: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const services = useContext(ServicesContext);
  const [profile, setProfile] = useState(newProfile);
  const layout = useLayout();
  useEffect(() => {
    services.apiClient.getProfile().then(data => setProfile(prev => ({ ...prev, ...data })));
  }, [services]);

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
        services.apiClient.getProfile().then(data => setProfile(prev => ({ ...prev, ...data })));
        services.toaster.show({
          message: status.Success,
          intent: Intent.SUCCESS
        });
      }
    });
  }, [profile, services]);

  const addLink = useCallback(() => {
    profile.SocialLinks.push('');
    set('SocialLinks', profile.SocialLinks);
  }, [profile, set]);

  const setLink = useCallback(
    (index, val) => {
      profile.SocialLinks[index] = val;
      set('SocialLinks', profile.SocialLinks);
    },
    [profile, set]
  );

  const deleteLink = useCallback(
    index => {
      profile.SocialLinks.splice(index, 1);
      set('SocialLinks', profile.SocialLinks);
    },
    [profile, set]
  );

  return (
    <Page>
      <Overlay isOpen={isSaving} className="loading-overlay">
        <Spinner intent={Intent.PRIMARY} className="loading-overlay__spinner" />
      </Overlay>

      <div className={layout === Layout.Mobile ? 'story-fields profile' : 'story-fields profile desctop'}>
        <H2>Мой профиль</H2>
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
        <FormGroup className="bp3-inline story-field story-field--inline social-links">
          <span className="story-field__label-text">Мои контакты в соц сетях</span>
          <Button intent={Intent.SUCCESS} icon="add" onClick={addLink}>
            Добавить
          </Button>
          <ControlGroup vertical={true}>
            {(profile.SocialLinks ?? []).map((x, idx) => (
              <Validatable key={idx} error={errors.SocialLinks ? errors.SocialLinks[idx] : undefined}>
                <InputGroup
                  key={idx}
                  placeholder="https://facebook.com/..."
                  value={x}
                  onChange={(evt: React.FormEvent<HTMLInputElement>) => setLink(idx, evt.currentTarget.value)}
                  rightElement={
                    <Button intent={Intent.DANGER} minimal={true} icon="trash" onClick={() => deleteLink(idx)}></Button>
                  }
                />
              </Validatable>
            ))}
          </ControlGroup>
        </FormGroup>

        <Button intent={Intent.PRIMARY} onClick={save}>
          Сохранить
        </Button>
      </div>
    </Page>
  );
};

export default Profile;
