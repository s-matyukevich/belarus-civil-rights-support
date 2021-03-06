import React from 'react';
import Page from '../app/Page';
import './PrivacyPolicy.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <Page>
      <div className="privacy-policy">
        <h1>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h1>

        <code>
          Вся информация которую Пользователь сохраняет на сайте dapamazhy.by является полностью публичной. Мы не храним
          конфиденциальных данных, если Пользователь вводит и сохраняет информацию на сайте он автоматически дает
          согласие на то что это информация будет доступа всем остальным пользователям. Использование Пользователем
          Сайта означает согласие с настоящей Политикой конфиденциальности.{' '}
        </code>
      </div>
    </Page>
  );
};

export default PrivacyPolicy;
