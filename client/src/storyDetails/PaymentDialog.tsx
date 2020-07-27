import { Classes, Dialog, Button, Intent, Label, ControlGroup } from '@blueprintjs/core';
import { StoryDetails } from '../model';
import React, { useState, useCallback, useContext } from 'react';
import Validatable from '../common/Validatable';
import { PaymentModel } from '../model';
import cn from 'classnames';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import ServicesContext from '../services/servicesContext';

type ValidatonErrors = Partial<Record<keyof PaymentModel, string>>;

const newPayment: PaymentModel = {
  Amount: '',
  Type: '',
  Currency: 'BYR',
  Email: '',
  ReferenceNumber: '',
  StoryID: 0
};

const PaymentDialog: React.FC<{
  type: string;
  story: StoryDetails;
  dialogIsOpen: boolean;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ type, story, dialogIsOpen, setDialogIsOpen }) => {
  const [model, setModel] = useState(newPayment);
  const [errors, setErrors] = useState<ValidatonErrors>({});
  const layout = useLayout();
  const services = useContext(ServicesContext);

  const set = useCallback((field: keyof PaymentModel, value: any) => {
    setModel(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const submitPayment = () => {
    setErrors({});
    model.Type = type;
    model.StoryID = story.ID;
    services.apiClient.submitPayment(model).then(status => {
      if (status.Errors) {
        setErrors(status.Errors);
      } else {
        setDialogIsOpen(false);
        services.toaster.show({
          message: status.Success,
          intent: Intent.SUCCESS
        });
      }
    });
  };
  return (
    <Dialog
      className="payment-dialog"
      isOpen={dialogIsOpen}
      onClose={() => setDialogIsOpen(false)}
      title="Как перевести деньги"
      onOpening={() => {
        setErrors({});
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        {type === 'phone' ? (
          <div>
            <ol>
              <li>
                Перейдите по ссылке{' '}
                <a target="_blank" href="https://www.sbs4u.by/p2p/index.html" rel="noopener noreferrer">
                  https://www.sbs4u.by/p2p/index.html
                </a>
              </li>
              <li>
                Укажите номер своей банковской карты, сумму и номер телефона: <b>{story.PaymentPhone}</b>
              </li>
              <li>После завершения перевода вернитесь на сайт Дапамажы.by, укажите сумму перевода и выберите валюту</li>
              <li>Укажите свой емейл чтобы автор истории смог связаться с Вами.</li>
              <li>
                Вы также можете связаться с автором истории напрямую используя следующие емейл: {story.PaymentEmail}
              </li>
            </ol>
            <div className={layout === Layout.Mobile ? 'story-fields' : 'story-fields desctop'}>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Сумма</span>
                <Validatable error={errors.Amount}>
                  <ControlGroup>
                    <input
                      type="text"
                      value={model.Amount}
                      className={cn(Classes.INPUT, 'story-field__editor')}
                      onChange={evt => set('Amount', evt.target.value)}
                      placeholder=""
                    />
                    <select
                      value={model.Currency}
                      onChange={e => {
                        set('Currency', e.currentTarget.value);
                      }}
                    >
                      <option value="BYR">BYR</option>
                      <option value="USD">USD</option>
                    </select>
                  </ControlGroup>
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Ваш емейл</span>
                <Validatable error={errors.Email}>
                  <input
                    type="text"
                    value={model.Email}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('Email', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
            </div>
          </div>
        ) : null}

        {type === 'card' ? (
          <div>
            <ol>
              <li>
                Перейдите по{' '}
                <a target="_blank" href={story.CardLink} rel="noopener noreferrer">
                  ссылке
                </a>
              </li>
              <li>Укажите номер своей банковской карты, сумму и сделайте перевод</li>
              <li>После завершения перевода вернитесь на сайт Дапамажы.by, укажите сумму перевода и выберите валюту</li>
              <li>Укажите свой емейл чтобы автор истории смог связаться с Вами.</li>
              <li>
                Вы также можете связаться с автором истории напрямую используя следующие емейл: {story.PaymentEmail}
              </li>
            </ol>
            <div className={layout === Layout.Mobile ? 'story-fields' : 'story-fields desctop'}>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Сумма</span>
                <Validatable error={errors.Amount}>
                  <ControlGroup>
                    <input
                      type="text"
                      value={model.Amount}
                      className={cn(Classes.INPUT, 'story-field__editor')}
                      onChange={evt => set('Amount', evt.target.value)}
                      placeholder=""
                    />
                    <select
                      value={model.Currency}
                      onChange={e => {
                        set('Currency', e.currentTarget.value);
                      }}
                    >
                      <option value="BYR">BYR</option>
                      <option value="USD">USD</option>
                    </select>
                  </ControlGroup>
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Ваш емейл</span>
                <Validatable error={errors.Email}>
                  <input
                    type="text"
                    value={model.Email}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('Email', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
            </div>
          </div>
        ) : null}
        {type === 'cardraw' ? (
          <div>
            <ol>
              <li>
                Перейдите по{' '}
                <a
                  target="_blank"
                  href="https://plati.tut.by/perevod/perevod-s-karty-na-kartu-belveb-bank"
                  rel="noopener noreferrer"
                >
                  ссылке
                </a>
              </li>
              <li>Укажите номер своей банковской карты и сумму</li>
              <li>
                Укажите номер карты получателя <b>{story.CardRaw}</b> и сделайте перевод
              </li>
              <li>После завершения перевода вернитесь на сайт Дапамажы.by, укажите сумму перевода и выберите валюту</li>
              <li>Укажите свой емейл чтобы автор истории смог связаться с Вами.</li>
              <li>
                Вы также можете связаться с автором истории напрямую используя следующие емейл: {story.PaymentEmail}
              </li>
            </ol>
            <div className={layout === Layout.Mobile ? 'story-fields' : 'story-fields desctop'}>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Сумма</span>
                <Validatable error={errors.Amount}>
                  <ControlGroup>
                    <input
                      type="text"
                      value={model.Amount}
                      className={cn(Classes.INPUT, 'story-field__editor')}
                      onChange={evt => set('Amount', evt.target.value)}
                      placeholder=""
                    />
                    <select
                      value={model.Currency}
                      onChange={e => {
                        set('Currency', e.currentTarget.value);
                      }}
                    >
                      <option value="BYR">BYR</option>
                      <option value="USD">USD</option>
                    </select>
                  </ControlGroup>
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Ваш емейл</span>
                <Validatable error={errors.Email}>
                  <input
                    type="text"
                    value={model.Email}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('Email', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
            </div>
          </div>
        ) : null}

        {type === 'mg' ? (
          <div>
            <ol>
              <li>
                Перейдите по ссылке{' '}
                <a target="_blank" href="https://www.moneygram.com/" rel="noopener noreferrer">
                  https://www.moneygram.com/
                </a>{' '}
                и следуйте инструкциям для перевода денег в Беларусь.
              </li>
              <li>
                В качестве получателя укажите{' '}
                <b>
                  {story.PaymentFirstName} {story.PaymentLastName}
                </b>
              </li>
              <li>После завершения перевода вернитесь на сайт Дапамажы.by, укажите сумму перевода и выберите валюту</li>
              <li>
                <b>Также обязательно укажите код платежа (Reference #)</b> - без него получатель не сможет забрать свои
                деньги
              </li>
              <li>Укажите свой емейл чтобы автор истории смог связаться с Вами.</li>
              <li>
                Вы также можете связаться с автором истории напрямую используя следующие емейл: {story.PaymentEmail}
              </li>
            </ol>
            <div className={layout === Layout.Mobile ? 'story-fields' : 'story-fields desctop'}>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Сумма</span>
                <Validatable error={errors.Amount}>
                  <ControlGroup>
                    <input
                      type="text"
                      value={model.Amount}
                      className={cn(Classes.INPUT, 'story-field__editor')}
                      onChange={evt => set('Amount', evt.target.value)}
                      placeholder=""
                    />
                    <select
                      value={model.Currency}
                      onChange={e => {
                        set('Currency', e.currentTarget.value);
                      }}
                    >
                      <option value="BYR">BYR</option>
                      <option value="USD">USD</option>
                    </select>
                  </ControlGroup>
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Код платежа</span>
                <Validatable error={errors.ReferenceNumber}>
                  <input
                    type="text"
                    value={model.ReferenceNumber}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('ReferenceNumber', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Ваш емейл</span>
                <Validatable error={errors.Email}>
                  <input
                    type="text"
                    value={model.Email}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('Email', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
            </div>
          </div>
        ) : null}

        {type === 'wu' ? (
          <div>
            <ol>
              <li>
                Перейдите по ссылке{' '}
                <a target="_blank" href="https://www.westernunion.com/" rel="noopener noreferrer">
                  https://www.westernunion.com/
                </a>{' '}
                и следуйте инструкциям для перевода денег в Беларусь.
              </li>
              <li>
                В качестве получателя укажите{' '}
                <b>
                  {story.PaymentFirstName} {story.PaymentLastName}
                </b>
              </li>
              {story.PaymentAddress ? (
                <li>
                  Если потребуется, укажите следующий адрес получателя <b>{story.PaymentAddress}</b>
                </li>
              ) : null}

              <li>После завершения перевода вернитесь на сайт Дапамажы.by, укажите сумму перевода и выберите валюту</li>
              <li>
                <b>Также обязательно укажите код платежа (tracking number)</b> - без него получатель не сможет забрать
                свои деньги
              </li>
              <li>Укажите свой емейл чтобы автор истории смог связаться с Вами.</li>
              <li>
                Вы также можете связаться с автором истории напрямую используя следующие емейл: {story.PaymentEmail}
              </li>
            </ol>
            <div className={layout === Layout.Mobile ? 'story-fields' : 'story-fields desctop'}>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Сумма</span>
                <Validatable error={errors.Amount}>
                  <ControlGroup>
                    <input
                      type="text"
                      value={model.Amount}
                      className={cn(Classes.INPUT, 'story-field__editor')}
                      onChange={evt => set('Amount', evt.target.value)}
                      placeholder=""
                    />
                    <select
                      value={model.Currency}
                      onChange={e => {
                        set('Currency', e.currentTarget.value);
                      }}
                    >
                      <option value="BYR">BYR</option>
                      <option value="USD">USD</option>
                    </select>
                  </ControlGroup>
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Код платежа</span>
                <Validatable error={errors.ReferenceNumber}>
                  <input
                    type="text"
                    value={model.ReferenceNumber}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('ReferenceNumber', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
              <Label className="bp3-inline story-field story-field--inline">
                <span className="story-field__label-text">Ваш емейл</span>
                <Validatable error={errors.Email}>
                  <input
                    type="text"
                    value={model.Email}
                    className={cn(Classes.INPUT, 'story-field__editor')}
                    onChange={evt => set('Email', evt.target.value)}
                    placeholder=""
                  />
                </Validatable>
              </Label>
            </div>
          </div>
        ) : null}
        <br />
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent={Intent.PRIMARY} text="Сохранить" onClick={() => submitPayment()} />
          <Button intent={Intent.DANGER} text="Отмена" onClick={() => setDialogIsOpen(false)} />
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentDialog;
