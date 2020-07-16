import React, { useState } from 'react';
import { Classes, Dialog, H5, Collapse } from '@blueprintjs/core';
import SocialGroups from '../common/SocialGroups';

const InstructionsContent: React.FC = () => {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  return (
    <div className={Classes.DIALOG_BODY}>
      <H5
        onClick={() => {
          setIsOpen1(true);
          setIsOpen2(false);
          setIsOpen3(false);
        }}
      >
        Переводы по номеру телефона внутри Беларуси
      </H5>
      <Collapse isOpen={isOpen1}>
        <p>
          Мы рекомендуем пользоваться данным способом переводов потому что он простой и удобный и потому что Вам не
          нужно указываете номер своей карты, что является небезопасным.
        </p>
        <p>Чтобы воспользоваться данным способом делаем следующее:</p>
        <ol>
          <li>
            Копируем и вставляем следующий текст в поле <b>Как мне можно помочь</b> <br />
            <code>
              Для того чтобы перевести мне деньги по номеру телефона
              <ol>
                <li>
                  Переходим по ссылке{' '}
                  <a target="_blank" href="https://www.sbs4u.by/p2p/index.html" rel="noopener noreferrer">
                    https://www.sbs4u.by/p2p/index.html
                  </a>
                </li>
                <li>
                  Указываем номер своей банковской карты, сумму и мой номер телефона <b>+375-29-XXXXXXX</b>
                </li>
              </ol>
            </code>
          </li>
          <li>
            Заменяем <b>+375-29-XXXXXXX</b> на свой номер телефона
          </li>
          <li>
            Как только вам поступт первый платеж, на ваш номер тебефона будет отправлено SMS сообщение с инструкциями
            как получить деньги. Можно не дожидаться SMS сообщения и заранее зарегистрироваться на{' '}
            <a target="_blank" href="https://transfers.mastercard.by/" rel="noopener noreferrer">
              сайте
            </a>{' '}
            сервиса Mastercard Money Transfers, войти в личный кабинет и подтвердить согласие на получение перевода.
          </li>
        </ol>
        <p>
          Подробнее об услуге перевода денег по номеру мобильного телефона читайте{' '}
          <a
            rel="noopener noreferrer"
            href="https://www.belveb.by/about/novosti/novosti-banka/Bank-BelVEB-sovmestno-s-Mastercard-zapustil-denezhnye-perevody-po-nomeru-telefona-mezhdu-kartochkami/"
          >
            здесь
          </a>
        </p>
      </Collapse>
      <H5
        onClick={() => {
          setIsOpen1(false);
          setIsOpen2(true);
          setIsOpen3(false);
        }}
      >
        Переводы из-за границы
      </H5>
      <Collapse isOpen={isOpen2}>
        <p>
          Чтобы получать деньги из-за границы мы рекомендуем пользоваться сервисом{' '}
          <a target="_blank" href="https://www.moneygram.com/" rel="noopener noreferrer">
            MoneyGram
          </a>{' '}
          Отправитель сможет перечислить вам деньги онлайн на сайте WesternUnion. Для этого ему нужно будет указать ваше
          Имя и Фамилию (как они у Вас написаны латиницей в паспорте) и страну получателя (Беларусь) MoneyGram
          предоставит отправителю код платежа который он должен будет Вам переслать. Вам же, чтобы получить деньги,
          придется пройти в ближайшее{' '}
          <a
            target="_blank"
            href="https://www.google.com/search?sxsrf=ALeKk03gCC0O11bgzrpElHHEZBS_E7yazg:1594573011853&q=moneyGram+belarus&npsic=0&rflfq=1&rlha=0&rllag=53174867,29280004,141754&tbm=lcl&ved=2ahUKEwi6-sGvl8jqAhUEQawKHS4_D1EQtgN6BAgLEAQ&rldoc=1#rlfi=hd:;si:;mv:[[55.3821042,31.448970799999998],[51.9102914,23.257892299999998]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u16!2m2!16m1!1e1!1m4!1u16!2m2!16m1!1e2!2m1!1e16!2m1!1e3!3sIAE,lf:1,lf_ui:4"
            rel="noopener noreferrer"
          >
            отделение MoneyGram
          </a>{' '}
          Для получения денег нужно предоставить свой паспорт и сказать код платежа (Эти данные должен будет передать
          отправитель)
        </p>
        <ol>
          <li>
            Копируем и вставляем следующий текст в поле <b>Как мне можно помочь</b> <br />
            <code>
              Для того чтобы перевести мне деньги из-за границы используя MoneyGram:
              <ol>
                <li>
                  Переходим по ссылке{' '}
                  <a target="_blank" href="https://www.moneygram.com/" rel="noopener noreferrer">
                    https://www.moneygram.com/
                  </a>{' '}
                  и следуем инструкциям для перевода денег в Беларусь.
                </li>
                <li>
                  В качестве получателя указываем <b>[Здесь пишем ваше имя и фамилию латиницей, как в паспорте]</b>
                </li>
                <li>
                  Пишем мне на <b>[Здесь указываем ваш емейл]</b> и пересылаем <b>Код платежа (Reference number)</b>
                </li>
              </ol>
            </code>
          </li>
          <li>
            Заменяем <b>[Здесь пишем ваше имя и фамилию латиницей, как в паспорте]</b> и{' '}
            <b>[Здесь указываем ваш емейл]</b> на свои имя фамилию и емейл
          </li>
          <li>
            Как только Вы получили всю нужную информацию от отправителя Вы идете в любое{' '}
            <a
              target="_blank"
              href="https://www.google.com/search?sxsrf=ALeKk03gCC0O11bgzrpElHHEZBS_E7yazg:1594573011853&q=moneyGram+belarus&npsic=0&rflfq=1&rlha=0&rllag=53174867,29280004,141754&tbm=lcl&ved=2ahUKEwi6-sGvl8jqAhUEQawKHS4_D1EQtgN6BAgLEAQ&rldoc=1#rlfi=hd:;si:;mv:[[55.3821042,31.448970799999998],[51.9102914,23.257892299999998]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u16!2m2!16m1!1e1!1m4!1u16!2m2!16m1!1e2!2m1!1e16!2m1!1e3!3sIAE,lf:1,lf_ui:4"
              rel="noopener noreferrer"
            >
              отделение MoneyGram
            </a>{' '}
            с паспортом и забираете свои деньги.
          </li>
        </ol>
      </Collapse>
      <H5
        onClick={() => {
          setIsOpen1(false);
          setIsOpen2(false);
          setIsOpen3(true);
        }}
      >
        Другие варианты переводов
      </H5>
      <Collapse isOpen={isOpen3}>
        <ul>
          <li>
            <a target="_blank" href="https://www.card2card.by/" rel="noopener noreferrer">
              https://www.card2card.by/
            </a>{' '}
            - здесь можно сгенерировать ссылку по которой отправитель сможет переслать Вам деньги. Для этого отправителю
            не нужно будет знать номер Вашей карты.
          </li>
          <li>
            <a
              target="_blank"
              href="https://myfin.by/wiki/term/kak-perevesti-dengi-s-kartochki-na-kartochku"
              rel="noopener noreferrer"
            >
              https://myfin.by/wiki/term/kak-perevesti-dengi-s-kartochki-na-kartochku
            </a>{' '}
            - Еще несколько вариантов для внутренних переводов.
          </li>

          <li>
            <a target="_blank" href="https://www.westernunion.com/" rel="noopener noreferrer">
              WesternUnion
            </a>{' '}
            - Сервис работающий по той же схеме что и WesternUnion. У него больше комиссия за перевод, но в то же время
            у него есть намного больше{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://yandex.by/maps/157/minsk/chain/western_union/65739431630/?ll=27.553521%2C53.890164&sll=27.553522%2C53.890069&z=11"
            >
              отделений в Беларуси
            </a>{' '}
            Для переводов через WesternUnion Вам скорее всего придется предоставить отправителю Ваш адрес.
          </li>
          <li>
            <a target="_blank" href="https://myfin.by/wiki/term/webmoney" rel="noopener noreferrer">
              WebMoney
            </a>
          </li>
          <li>
            <a target="_blank" href="https://myfin.by/wiki/term/elektronnyj-koshelek-easypay" rel="noopener noreferrer">
              EasyPay
            </a>
          </li>
          <li>
            <a target="_blank" href="https://finance.tut.by/news573536.html" rel="noopener noreferrer">
              Криптовалюта
            </a>{' '}
            - полностью анонимный способ пеервода денег.
          </li>
        </ul>
      </Collapse>
      <SocialGroups
        header=""
        text="Если Вам нужна помощь в добавлении платежных реквизитов вы можете задать вопрос в одной из наших групп"
      ></SocialGroups>

      <br />
      <div className={Classes.DIALOG_FOOTER_ACTIONS}></div>
    </div>
  );
};

const InstructionsDialog: React.FC<{
  dialogIsOpen: boolean;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ dialogIsOpen, setDialogIsOpen }) => {
  return (
    <Dialog
      className="instructions-dialog"
      isOpen={dialogIsOpen}
      onClose={() => setDialogIsOpen(false)}
      title="Инструкция по добавлению платежных реквизитов"
    >
      <InstructionsContent></InstructionsContent>
    </Dialog>
  );
};

export default InstructionsDialog;
