import React from 'react';
import { Classes, H5, Collapse, Label, Card, Elevation } from '@blueprintjs/core';
import Validatable from '../common/Validatable';
import { StoryModel } from '../model';
import cn from 'classnames';
import { ValidatonErrors } from './AddStory';

const Payment: React.FC<{
  model: StoryModel;
  errors: ValidatonErrors;
  set: (field: keyof StoryModel, value: any) => void;
  setErrors: React.Dispatch<React.SetStateAction<ValidatonErrors>>;
}> = ({ model, errors, set, setErrors }) => {
  // const [isOpenMoneygram, setIsOpenMoneygram] = useState(false);
  const clearPaymentErrors = () => {
    setErrors(err => ({
      ...err,
      PaymentPhone: undefined,
      PaymentEmail: undefined,
      CardLink: undefined,
      PaymentFirstName: undefined,
      PaymentLastName: undefined,
      PaymentAddress: undefined
    }));
  };
  return (
    <div className="payment">
      <Card elevation={Elevation.TWO}>
        <H5
          onClick={() => {
            clearPaymentErrors();
            set('PhoneEnabled', !model.PhoneEnabled);
          }}
        >
          <input type="checkbox" checked={model.PhoneEnabled} /> Я хочу получать средства по номеру телефона внутри РБ
        </H5>
        <Collapse isOpen={model.PhoneEnabled}>
          <p>
            Мы рекомендуем пользоваться данным способом переводов потому что он простой и удобный и потому что Вам не
            нужно указываеть номер своей карты, что является небезопасным.
          </p>
          <p>
            Подробнее об услуге перевода денег по номеру мобильного телефона читайте{' '}
            <a
              rel="noopener noreferrer"
              href="https://www.belveb.by/about/novosti/novosti-banka/Bank-BelVEB-sovmestno-s-Mastercard-zapustil-denezhnye-perevody-po-nomeru-telefona-mezhdu-kartochkami/"
            >
              здесь
            </a>
          </p>
          <p>Чтобы воспользоваться данным способом введите следующее:</p>
          <div className="payment">
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Номер телефона</span>
              <Validatable error={errors.PaymentPhone}>
                <input
                  type="text"
                  value={model.PaymentPhone}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentPhone', evt.target.value)}
                  placeholder="+37529XXXXXXX"
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.PaymentEmail}>
                <input
                  type="text"
                  value={model.PaymentEmail}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentEmail', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
          </div>
        </Collapse>
      </Card>
      <Card elevation={Elevation.TWO}>
        <H5
          onClick={() => {
            clearPaymentErrors();
            set('CardEnabled', !model.CardEnabled);
          }}
        >
          <input type="checkbox" checked={model.CardEnabled} /> Я хочу получать средства на карту банка РБ по секретной
          ссылке
        </H5>
        <Collapse isOpen={model.CardEnabled}>
          <div className="payment">
            <p>
              При использовании этой опиции ни сайт "Дапамажы.by" ни отправительно не будут знать номер вашей карты.
              Ваша карта указывается только на сайте Белагропромбанка, который и осуществляет перевод.
            </p>
            <p>Чтобы воспользоваться данным способом сделайте следующее:</p>
            <ul>
              <li>
                Перейдите по ссылке:{' '}
                <a target="_blank" rel="noopener noreferrer" href="https://www.card2card.by/">
                  https://www.card2card.by/
                </a>
              </li>
              <li>
                Выберите опцью <b>Создать QR-код / ссылку для перевода</b>
              </li>
              <li>
                Введите номер своей карты, имя держателя карты и сумму (Отправитель при желании сможет эту сумму
                поменять) Затем нажмите кнопку "Создать ссылку / QR-код"
              </li>
              <li>Скопируйте ссылку и вставьте ее в следующее поле</li>
            </ul>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Ссылка для перевода</span>
              <Validatable error={errors.CardLink}>
                <input
                  type="text"
                  value={model.CardLink}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('CardLink', evt.target.value)}
                  placeholder="https://www.card2card.by/pbu/..."
                />
              </Validatable>
            </Label>
            <p>Также не забудьте указать Ваш емейл</p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.PaymentEmail}>
                <input
                  type="text"
                  value={model.PaymentEmail}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentEmail', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
          </div>
        </Collapse>
      </Card>
      <Card elevation={Elevation.TWO}>
        <H5
          onClick={() => {
            clearPaymentErrors();
            set('CardRawEnabled', !model.CardRawEnabled);
          }}
        >
          <input type="checkbox" checked={model.CardRawEnabled} /> Я хочу получать средства напрямую на карту банка РБ
        </H5>
        <Collapse isOpen={model.CardRawEnabled}>
          <div className="payment">
            <b>
              Мы не рекомендуем пользоваться этой опицией, потому что любой человек сможет узнать номер Вашей карты.
            </b>
            <p>Чтобы воспользоваться данным способом введите следующие данные:</p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Номер Вашей карты</span>
              <Validatable error={errors.CardRaw}>
                <input
                  type="text"
                  value={model.CardRaw}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('CardRaw', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <p>Также не забудьте указать Ваш емейл</p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.PaymentEmail}>
                <input
                  type="text"
                  value={model.PaymentEmail}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentEmail', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
          </div>
        </Collapse>
      </Card>

      <Card elevation={Elevation.TWO}>
        <H5
          onClick={() => {
            clearPaymentErrors();
            set('MGEnabled', !model.MGEnabled);
          }}
        >
          <input type="checkbox" checked={model.MGEnabled} /> Я хочу получать средства из-за границы используя сервис{' '}
          <a target="_blank" href="https://www.moneygram.com/" rel="noopener noreferrer">
            MoneyGram
          </a>
        </H5>
        <Collapse isOpen={model.MGEnabled}>
          <div className="payment">
            <p>
              Отправитель сможет перечислить вам деньги онлайн на сайте MoneyGram. Для этого ему нужно будет указать
              ваше Имя и Фамилию (как они у Вас написаны латиницей в паспорте) и страну получателя (Беларусь) MoneyGram
              предоставит отправителю код платежа который он должен будет Вам переслать через наш сайт. Вам же, чтобы
              получить деньги, придется пройти в ближайшее{' '}
              <a
                target="_blank"
                href="https://www.google.com/search?sxsrf=ALeKk03gCC0O11bgzrpElHHEZBS_E7yazg:1594573011853&q=moneyGram+belarus&npsic=0&rflfq=1&rlha=0&rllag=53174867,29280004,141754&tbm=lcl&ved=2ahUKEwi6-sGvl8jqAhUEQawKHS4_D1EQtgN6BAgLEAQ&rldoc=1#rlfi=hd:;si:;mv:[[55.3821042,31.448970799999998],[51.9102914,23.257892299999998]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u16!2m2!16m1!1e1!1m4!1u16!2m2!16m1!1e2!2m1!1e16!2m1!1e3!3sIAE,lf:1,lf_ui:4"
                rel="noopener noreferrer"
              >
                отделение MoneyGram
              </a>{' '}
              Для получения денег нужно предоставить свой паспорт и сказать код платежа (Код платежа отправитель укажет
              на сайте Дапамажы.by и мы его автоматически перешлем Вам)
            </p>
            <p>
              Обязательно укажите свое имя и фамилию <b>латиницей, как в паспорте</b>
            </p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Имя</span>
              <Validatable error={errors.PaymentFirstName}>
                <input
                  type="text"
                  value={model.PaymentFirstName}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentFirstName', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Фамилия</span>
              <Validatable error={errors.PaymentLastName}>
                <input
                  type="text"
                  value={model.PaymentLastName}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentLastName', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.PaymentEmail}>
                <input
                  type="text"
                  value={model.PaymentEmail}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentEmail', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
          </div>
        </Collapse>
      </Card>
      <Card elevation={Elevation.TWO}>
        <H5
          onClick={() => {
            clearPaymentErrors();
            set('WUEnabled', !model.WUEnabled);
          }}
        >
          <input type="checkbox" checked={model.WUEnabled} /> Я хочу получать средства из-за границы используя сервис{' '}
          <a target="_blank" href="https://www.westernunion.com/" rel="noopener noreferrer">
            WesternUnion
          </a>
        </H5>
        <Collapse isOpen={model.WUEnabled}>
          <div className="payment">
            <a target="_blank" href="https://www.westernunion.com/" rel="noopener noreferrer">
              WesternUnion
            </a>{' '}
            - Сервис работающий по той же схеме что и MoneyGram (подробнее читайте выше). У него больше комиссия за
            перевод, но в то же время у него есть намного больше{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://yandex.by/maps/157/minsk/chain/western_union/65739431630/?ll=27.553521%2C53.890164&sll=27.553522%2C53.890069&z=11"
            >
              отделений в Беларуси
            </a>{' '}
            Для переводов через WesternUnion Вам скорее всего придется предоставить отправителю Ваш адрес (Вы можете
            оставить поле Адрес пустым, но в определенных случаях WesternUnion пребует предоставить адрес получателя)
            <p>
              Обязательно укажите свое имя и фамилию <b>латиницей, как в паспорте</b>
            </p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Имя</span>
              <Validatable error={errors.PaymentFirstName}>
                <input
                  type="text"
                  value={model.PaymentFirstName}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentFirstName', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Фамилия</span>
              <Validatable error={errors.PaymentLastName}>
                <input
                  type="text"
                  value={model.PaymentLastName}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentLastName', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Адрес</span>
              <Validatable error={errors.PaymentAddress}>
                <input
                  type="text"
                  value={model.PaymentAddress}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentAddress', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.PaymentEmail}>
                <input
                  type="text"
                  value={model.PaymentEmail}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  onChange={evt => set('PaymentEmail', evt.target.value)}
                  placeholder=""
                />
              </Validatable>
            </Label>
          </div>
        </Collapse>
      </Card>
    </div>
  );
};

export default Payment;
