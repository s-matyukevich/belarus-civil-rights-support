import { H4 } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import Page from '../app/Page';
import { useParams } from 'react-router-dom';
import { useServices, usePromise } from '../common/hooks';
import { getYoutubeVideoId } from '../common/utils';
import YouTube from 'react-youtube';
import './StoryDetails.css';

const leftColumnWidth = '650px';

const StoryPage: React.FC = () => {
  const { id } = useParams();
  const services = useServices();
  const [storyIsLoading, story] = usePromise(() => services.apiClient.getStoryModel(id));
  const videoId: string | null = useMemo(() => getYoutubeVideoId(story?.VideoUrl), [story]);

  return storyIsLoading ? null : (
    <Page>
      <H4>{story!.Title}</H4>
      <div className="story-details">
        <div className="story-details__left-column" style={{ width: leftColumnWidth }}>
          {videoId ? <YouTube videoId={videoId} opts={{ width: leftColumnWidth }} /> : null}
          <div>{story?.Description}</div>
        </div>
        <div>{story?.HelpInstructions}</div>
      </div>
    </Page>
  );
};

export default StoryPage;
