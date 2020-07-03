import React, { useState } from 'react';
import { Classes, Dialog, H5, Collapse } from '@blueprintjs/core';

const InstructionsContent: React.FC = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  return (
    <div className={Classes.DIALOG_BODY}>
      <H5
        onClick={() => {
          setIsOpen1(true);
          setIsOpen2(false);
          setIsOpen2(false);
        }}
      >
        Переводы по номеру телефона внутри Беларуси
      </H5>
      <Collapse isOpen={isOpen1}>
        <p>Чтобы воспользоваться данным способом делаем следующее:</p>
        <ol>
          <li>
            В поле <b>Как мне можно помочь</b> пишем примерно такой текст <br />
            <code>
              Для того чтобы перевести мне деньги
              <ol>
                <li>
                  Переходим по ссылке{' '}
                  <a target="_blank" href="https://www.sbs4u.by/p2p/index.html">
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
            Как только вам поступт первый платеж, на ваш номер тебефона будет отправлено SMS сообщение с инструкциями
            как получить деньги. Можно не дожидаться SMS сообщения и заранее зарегистрироваться на{' '}
            <a target="_blank" href="https://transfers.mastercard.by/">
              сайте
            </a>{' '}
            сервиса Mastercard Money Transfers, войти в личный кабинет и подтвердить согласие на получение перевода.
          </li>
        </ol>
        <p>
          Подробнее об услуге перевода денег по номеру мобильного телефона читайте{' '}
          <a href="https://www.belveb.by/about/novosti/novosti-banka/Bank-BelVEB-sovmestno-s-Mastercard-zapustil-denezhnye-perevody-po-nomeru-telefona-mezhdu-kartochkami/">
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
          <a target="_blank" href="https://www.westernunion.com">
            WesternUnion
          </a>{' '}
          Отправитель сможет перечислить вам деньги онлайн на сайте WesternUnion. Для этого ему нужно будет указать ваше
          Имя и Фамилию (как они у Вас написаны в паспорте) и страну отправления (Беларусь) WesternUnion предоставит
          отправителю код платежа который он должен будет Вам переслать. Вам же, чтобы получить деньги, придется пройти
          в ближайшее{' '}
          <a target="_blank" href="https://yandex.by/maps/157/minsk/chain/western_union/65739431630/">
            отделение WesternUnion
          </a>{' '}
          Для получения денег нужно предоставить свой паспорт, сказать код платежа и страну отправления (Эти данные
          должен будет передать отправитель)
        </p>
        <ol>
          <li>
            В поле <b>Как мне можно помочь</b> пишем примерно следующее <br />
            <code>
              Для того чтобы перевести мне деньги
              <ol>
                <li>
                  Переходим по ссылке{' '}
                  <a target="_blank" href="https://www.westernunion.com">
                    https://www.westernunion.com/
                  </a>{' '}
                  и следуем инструкциям для перевода денег в Беларусь.
                </li>
                <li>
                  В качестве получателя указываем <b>[Здесь пишем ваше имя]</b>
                </li>
                <li>
                  Пишем мне на <b>[Здесь указываем ваш емейл]</b> и пересылаем <b>Код платежа и страну отправителя</b>
                </li>
              </ol>
            </code>
          </li>
          <li>
            Как только вы получили всю нужную информацию от отправителя вы идете в любое{' '}
            <a target="_blank" href="https://yandex.by/maps/157/minsk/chain/western_union/65739431630/">
              отделение WesternUnion
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
            <a target="_blank" href="https://www.card2card.by/">
              https://www.card2card.by/
            </a>{' '}
            - здесь можно сгенерировать ссылку по которой отправитель сможет переслать Вам деньги. Для этого отправителю
            не нужно будет знать номер Вашей карты .
          </li>
          <li>
            <a target="_blank" href="https://myfin.by/wiki/term/kak-perevesti-dengi-s-kartochki-na-kartochku">
              https://myfin.by/wiki/term/kak-perevesti-dengi-s-kartochki-na-kartochku
            </a>{' '}
            - Еще несколько вариантов для внутренних переводов.
          </li>
          <li>
            <a target="_blank" href="https://myfin.by/wiki/term/webmoney">
              WebMoney
            </a>
          </li>
          <li>
            <a target="_blank" href="https://finance.tut.by/news573536.html">
              Криптовалюта
            </a>{' '}
            - полностью анонимный способ пеервода денег.
          </li>
        </ul>
      </Collapse>

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
