import {
  FacebookShareButton,
  FacebookIcon,
  VKShareButton,
  VKIcon,
  OKShareButton,
  OKIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  ViberShareButton,
  ViberIcon
} from 'react-share';
import React from 'react';
import './Share.css';

const Share: React.FC<{ url: string }> = ({ url }) => {
  const getUrl = () => {
    // This doesn't work on localhost!
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + url;
  };

  return (
    <div className="sosial-network-share">
      <FacebookShareButton url={getUrl()}>
        <FacebookIcon size={25} borderRadius={15} />
      </FacebookShareButton>
      <VKShareButton url={getUrl()}>
        <VKIcon size={25} borderRadius={15} />
      </VKShareButton>
      <OKShareButton url={getUrl()}>
        <OKIcon size={25} borderRadius={15} />
      </OKShareButton>
      <TwitterShareButton url={getUrl()}>
        <TwitterIcon size={25} borderRadius={15} />
      </TwitterShareButton>
      <TelegramShareButton url={getUrl()}>
        <TelegramIcon size={25} borderRadius={15} />
      </TelegramShareButton>
      <ViberShareButton url={getUrl()}>
        <ViberIcon size={25} borderRadius={15} />
      </ViberShareButton>
    </div>
  );
};

export default Share;
