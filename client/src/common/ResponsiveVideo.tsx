import React, { useMemo } from 'react';
import { getYoutubeVideoId } from './utils';
import YouTube, { Options } from 'react-youtube';
import './ResponsiveVideo.scss';
import cn from 'classnames';

type Props = {
  videoUrl: string;
  className?: string;
  responsive: boolean;
  options?: Options;
};

const ResponsiveVideo: React.FC<Props> = props => {
  const videoId = useMemo(() => getYoutubeVideoId(props.videoUrl), [props.videoUrl]);

  const classes = cn(props.className, {
    ['responsive-video']: props.responsive
  });

  return videoId ? (
    <div className={classes}>
      <YouTube videoId={videoId} opts={props.options} />
    </div>
  ) : null;
};

export default ResponsiveVideo;
