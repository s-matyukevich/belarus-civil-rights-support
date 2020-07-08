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

const Share: React.FC<{ url: string; onShare?: () => void }> = ({ url, onShare }) => {
  const getUrl = () => {
    // This doesn't work on localhost!
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + url;
  };

  return (
    <div className="sosial-network-share" onClick={evt => evt.stopPropagation()}>
      <FacebookShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <FacebookIcon size={25} borderRadius={15} />
      </FacebookShareButton>
      <VKShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <VKIcon size={25} borderRadius={15} />
      </VKShareButton>
      <OKShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <OKIcon size={25} borderRadius={15} />
      </OKShareButton>
      <TwitterShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <TwitterIcon size={25} borderRadius={15} />
      </TwitterShareButton>
      <TelegramShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <TelegramIcon size={25} borderRadius={15} />
      </TelegramShareButton>
      <ViberShareButton
        url={getUrl()}
        onClick={() => {
          onShare ? onShare() : null;
        }}
      >
        <ViberIcon size={25} borderRadius={15} />
      </ViberShareButton>
    </div>
  );
};

export default Share;
