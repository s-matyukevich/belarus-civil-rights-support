import Header from './Header';
import React, { ReactNode, useState, useContext, useCallback } from 'react';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import cn from 'classnames';
import { Intent, Button, H2, H5, H4, Divider, Collapse, Dialog, Classes, Label, Callout } from '@blueprintjs/core';
import ServicesContext from '../services/servicesContext';
import { ContactUs } from '../model';
import Validatable from '../common/Validatable';

type Props = {
  headerContent?: ReactNode;
};

let isOpenDefault = true;

type ValidatonErrors = Partial<Record<keyof ContactUs, string>>;

const newContactUs: ContactUs = {
  Message: '',
  Email: ''
};

const Page: React.FC<Props> = ({ children, headerContent }) => {
  const layout = useLayout();
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false);
  const [model, setModel] = useState<ContactUs>(newContactUs);
  const services = useContext(ServicesContext);
  const [errors, setErrors] = useState<ValidatonErrors>({});

  const classes = cn('page', {
    'page--mobile': layout === Layout.Mobile
  });

  const set = useCallback((field: keyof ContactUs, value: any) => {
    setModel(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const contactUs = useCallback(() => {
    setErrors({});
    services.apiClient.contactUs(model).then(status => {
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
  }, [model, services]);
  return (
    <div className={classes}>
      <Dialog
        className="info-dialog"
        isOpen={infoDialogIsOpen}
        onClose={() => setInfoDialogIsOpen(false)}
        title="Сбор средств"
      >
        <div className={Classes.DIALOG_BODY}>
          <b>
            Мы временно приостановили сбор средств. В нашем фонде уже есть более 5000$ - этого хватит чтобы полностью
            компенсировать возможную потерю работы первым 2-3 участникам на пол года. Сбор средств будет возобновлен как
            только мы найдем первого участника.
          </b>
          <Callout icon="list" intent={Intent.PRIMARY}>
            <H4>Алгоритм работы фонда</H4>
            <ol>
              <li>
                Мы собираем фонд из которого всем участникам избирательных комиссий потерявшим работу из-за отказа
                фальсифицировать выборы будет компенсироваться потеря работы.
              </li>
              <li>
                Предположим что я работаю в избирательной комиссии. Меня заставляют делать фальсификации. Я отказываюсь
                и вместо этого публично рассказываю о фальсификациях и возможно теряю работу.{' '}
              </li>
              <li>
                Я регистрируюсь на сайте Дапамажы.by рассказываю свою историю и указываю что я претендую на помощь из
                фонда.
              </li>
              <li>
                После проверки, фонд в течение некоторого времени компенсирует мне потерю работы. (Проверку можно будет
                выполнить очень легко, потому что список всех членов избирательных комиссий находится в открытом доспупе
                на сайте{' '}
                <a rel="noopener noreferrer" target="blank" href="https://zubr.in/">
                  zubr.in
                </a>
                )
              </li>
              <li>
                Мы уже собрали более 5 000$, учитывая среднюю зарплату белорусского учителя, а именно они зачастую
                работают в избирательных комиссиях, этого хватит на то чтобы полностью или частично компенсировать
                потерю работы для 2-3 людей в течении полугода.{' '}
              </li>
              <li>
                А теперь представьте что будут делать власти когда появится хотя бы несколько, возможно бывших,
                сотрудников избирательных комиссий готовых публично рассказать о проводимых фальсификациях? И это будут
                люди знающие всю подноготную системы.{' '}
              </li>
              <li>
                Пока что мы запускаем проект в тестовом режиме, но если он заработает, мы сможем распространить его на
                других людей (вторым по приоритету у нас стоят сотрудники силовых ведомств)
              </li>
            </ol>
          </Callout>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent={Intent.DANGER}
              onClick={() => {
                setInfoDialogIsOpen(false);
              }}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        className="contact-dialog"
        isOpen={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        title="Связаться с нами"
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={'story-fields'}>
            <p>Кратко расскажите о себе и укажите свой емейл. Мы обязательно с Вами свяжемся</p>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Емейл</span>
              <Validatable error={errors.Email}>
                <input
                  type="text"
                  value={model.Email}
                  onChange={evt => set('Email', evt.target.value)}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  placeholder="Емейл"
                />
              </Validatable>
            </Label>
            <Label className="bp3-inline story-field story-field--inline">
              <span className="story-field__label-text">Текст сообщения</span>
              <Validatable error={errors.Message}>
                <textarea
                  value={model.Message}
                  onChange={evt => set('Message', evt.target.value)}
                  className={cn(Classes.INPUT, 'story-field__editor')}
                  placeholder="Емейл"
                />
              </Validatable>
            </Label>
          </div>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.SUCCESS} onClick={contactUs} icon="saved">
              Отправить
            </Button>
          </div>
        </div>
      </Dialog>
      <Header>{headerContent}</Header>
      <Collapse isOpen={isOpen}>
        <Callout className="banner" icon="info-sign" intent={Intent.PRIMARY}>
          <h4 className="bp3-heading">
            Сбор средств
            <Button
              minimal={true}
              intent={Intent.PRIMARY}
              icon="cross"
              className="close"
              onClick={() => {
                isOpenDefault = false;
                setIsOpen(false);
              }}
            ></Button>
          </h4>
          <div className="wrapper">
            <div className="left">
              Команда Дапамажы.by проводит сбор средств для помощи членам избирательных комиссий потерявшим работу или
              финансово пострадавшим из-за отказа фальсифицировать результаты выоров.{' '}
              <a
                onClick={() => {
                  setInfoDialogIsOpen(true);
                }}
              >
                Читать подробнее...
              </a>
              <div className="buttons">
                <Button intent={Intent.SUCCESS} onClick={() => setDialogIsOpen(true)} icon="phone">
                  Связаться с нами
                </Button>
                {/* <Button
                  intent={Intent.SUCCESS}
                  icon="dollar"
                  onClick={() => {
                    window.location.assign('https://www.paypal.com/biz/fund?id=ARY4GTE4QDQ7L');
                  }}
                >
                  Перевести средства
                </Button> */}
              </div>
            </div>
            <div className="right">
              <Divider></Divider>
              <div className="block">
                <H2>5,328$</H2>
                <H5>Денег собрано</H5>
              </div>
              <Divider></Divider>
              <div className="block">
                <H2>0</H2>
                <H5>Людей получили помощь</H5>
              </div>
              <Divider className="block"></Divider>
              <div className="block">
                <H2>0</H2>
                <H5>Людей готовы участвовать</H5>
              </div>
            </div>
          </div>
        </Callout>
      </Collapse>
      <div className="page-content">{children}</div>
    </div>
  );
};

export default Page;
