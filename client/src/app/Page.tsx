import Header from './Header';
import React, { ReactNode, useState } from 'react';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import cn from 'classnames';
import { Callout, Intent, Button, H2, H5, Divider, Collapse } from '@blueprintjs/core';

type Props = {
  headerContent?: ReactNode;
};

let isOpenDefault = true;

const Page: React.FC<Props> = ({ children, headerContent }) => {
  const layout = useLayout();
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const classes = cn('page', {
    'page--mobile': layout === Layout.Mobile
  });

  return (
    <div className={classes}>
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
                setIsOpen(false)
              }}
            ></Button>
          </h4>
          <div className="wrapper">
            <div className="left">
              Команда Дапамажы.by проводит сбор средств для помощи членам избирательных комиссий потерявшим работу или
              финансово пострадавшим из-за отказа фальсифицировать результаты выоров. <a>Читать подробнее...</a>
              <div className="buttons">
                <Button icon="plus">Получить помощь</Button>
                <Button
                  intent={Intent.SUCCESS}
                  icon="dollar"
                  onClick={() => {
                    window.location.assign('https://www.paypal.com/biz/fund?id=ARY4GTE4QDQ7L');
                  }}
                >
                  Перевести средства
                </Button>
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
