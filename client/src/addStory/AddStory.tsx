import Page from '../app/Page';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { H3, Label, Classes, Button, Intent, Overlay, Spinner, Callout } from '@blueprintjs/core';
import './AddStory.scss';
import InstructionsDialog from './InstructionsDialog';
import cn from 'classnames';
import { useReferenceDataSelectors } from '../common/hooks';
import { StoryModel } from '../model';
import CommonMultiselect from '../common/CommonMultiselect';
import CommonEditor from '../common/CommonEditor';
import Validatable from '../common/Validatable';
import ServicesContext from '../services/servicesContext';
import Payment from './Payment';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useLayout, Layout } from '../responsiveness/viewportContext';

const newStory: StoryModel = {
  ID: 0,
  Title: '',
  Categories: [],
  Description: '',
  HelpInstructions: '',
  VideoUrl: '',
  CityID: undefined,
  IsDraft: false,
  PaymentEmail: '',
  PhoneEnabled: false,
  PaymentPhone: '',
  CardEnabled: false,
  CardLink: '',
  CardRawEnabled: false,
  CardRaw: '',
  MGEnabled: false,
  PaymentFirstName: '',
  PaymentLastName: '',
  WUEnabled: false,
  PaymentAddress: ''
};

export type ValidatonErrors = Partial<Record<keyof StoryModel, string>>;

const AddStory: React.FC = () => {
  const { cities, categories } = useReferenceDataSelectors();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const services = useContext(ServicesContext);
  const history = useHistory();
  const { id } = useParams();
  const [story, setStory] = useState(newStory);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const layout = useLayout();
  useEffect(() => {
    services.apiClient.getStoryModel(id).then(remoteStory => setStory(prev => ({ ...prev, ...remoteStory })));
  }, [id, services]);

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
  }, [story, services, history]);

  return (
    <Page>
      <Overlay isOpen={isSaving} className="loading-overlay">
        <Spinner intent={Intent.PRIMARY} className="loading-overlay__spinner" />
      </Overlay>
      <H3>История</H3>
      <div className={layout === Layout.Mobile ? 'story-fields add-story' : 'story-fields add-story desctop'}>
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
        <p className="bp3-text-disabled">
          <a
            href="https://support.google.com/youtube/answer/57407?co=GENIE.Platform%3DDesktop&hl=ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            Здесь
          </a>{' '}
          подробно рассказано как добавить свое видео на Youtube
        </p>

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
            <CommonEditor content={story.Description} onChange={content => set('Description', content)}></CommonEditor>
          </Validatable>
        </Label>
        <Payment model={story} errors={errors} set={set} setErrors={setErrors}></Payment>
        <Label className="story-field">
          <span className="story-field__label-text">Как еще мне можно помочь</span>
          <Validatable error={errors.HelpInstructions}>
            <CommonEditor
              content={story.HelpInstructions}
              onChange={content => set('HelpInstructions', content)}
            ></CommonEditor>
          </Validatable>
        </Label>
        <p className="bp3-text-disabled">
          Вы можете попросить людей помочь найти работу, или помочь советом, или просто поблагодарить людей которые
          будут вам помогать.{' '}
        </p>
        <Callout intent={Intent.WARNING} icon="warning-sign" title={'Для тех кто нуждается в финансовой поддержке'}>
          Oбращаем внимание, что если Вы в течение года получите сумму превышающую <b>6569 BYN</b>, то Вам необходимо
          будет заплатить с нее налог. Доходы полученные путем дарения не превышающие эту сумму, а так же деньги
          подаренные близкими родственниками налогом не облагаются. Подробности{' '}
          <a
            target="_blank"
            href="https://infobank.by/infolinebigview/nalog-za-perevod-na-bankovskuyu-kartu-kto-i-skoljko-dolzhen-platitj/"
            rel="noopener noreferrer"
          >
            тут
          </a>{' '}
          и{' '}
          <a target="_blank" href="http://xn----7sbgdhgzjccuobe2c0j.xn--90ais/statya-208" rel="noopener noreferrer">
            тут
          </a>
          . Это же правило касается денег{' '}
          <a
            target="_blank"
            href="http://www.nalog.gov.by/ru/m_publr_brest_ru/view/nalogooblozhenie-doxodov-fizicheskix-lits-poluchennyx-ot-istochnikov-za-predelami-respubliki-belarus-35280/"
            rel="noopener noreferrer"
          >
            полученных из-за границы
          </a>
        </Callout>

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
        <p className="bp3-text-disabled">
          Если Вы создаете гражданскую инициативу, участвовать в которой сможет какждый белорус, то можете оставить поле
          "Город" пустым. В противном случае, мы рекомендуем указать свой город, чтобы люди живущие рядом с Вами могли
          легче Вас найти и Вам помочь.
        </p>
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

        <Label className="bp3-inline story-field--inline">
          <span className="story-field__label-text">Не публиковать историю</span>
          <input
            type="checkbox"
            checked={story.IsDraft}
            onChange={evt => {
              set('IsDraft', evt.target.checked);
            }}
          />
        </Label>
        <Callout intent={Intent.WARNING} icon="warning-sign" title={'Не забудьте обновить свои котактные данные!'}>
          Чтобы другие люди могли связаться с Вами, пожалуйста, обновите контактную информацию на странице своего{' '}
          <a href="/#/profile">профиля</a>
        </Callout>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent={Intent.PRIMARY} onClick={publish}>
            Сохранить историю
          </Button>
          {story.ID ? (
            <Button intent={Intent.NONE} onClick={() => history.push(`/story/${story.ID}`)}>
                Просмотреть историю
            </Button>
          ) : null}
        </div>
      </div>
      <InstructionsDialog dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen}></InstructionsDialog>
    </Page>
  );
};

export default AddStory;
