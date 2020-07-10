import { FacebookIcon, VKIcon, OKIcon } from 'react-share';
import { Card } from '@blueprintjs/core';

import React from 'react';
import './SocialGroups.scss';

const SocialGroups: React.FC<{ header: string; text: string; className?: string }> = ({ header, text, className }) => {
  return (
    <Card className={'contact-menu ' + className} interactive={true}>
      <h3>{header}</h3>
      <p>{text}</p>
      <a target="_blank" href="https://www.facebook.com/groups/266490514617713/">
        <FacebookIcon size={25} borderRadius={15} />
      </a>
      <a target="_blank" href="https://vk.com/public196852521">
        <VKIcon size={25} borderRadius={15} />
      </a>
      <a target="_blank" href="https://ok.ru/group/57735585398851">
        <OKIcon size={25} borderRadius={15} />
      </a>
    </Card>
  );
};

export default SocialGroups;
