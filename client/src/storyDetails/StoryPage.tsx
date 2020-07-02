import { H1, H5, Checkbox } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import Page from '../app/Page';
import { useParams } from 'react-router-dom';
import { useServices, usePromise } from '../common/hooks';
import { getYoutubeVideoId } from '../common/utils';
import YouTube from 'react-youtube';
import './StoryDetails.css';
import Votes from '../common/Votes';
import Share from '../common/Share';

const leftColumnWidth = '650px';

const LongText: React.FC<{ text: string }> = ({ text }) => (
  <div className="story-details__description">
    {text.split('\n').map(line => (
      <p>{line}</p>
    ))}
  </div>
);

const StoryPage: React.FC = () => {
  const { id } = useParams();
  const services = useServices();
  const [storyIsLoading, story] = usePromise(() => services.apiClient.getStoryDetails(id), [id]);
  const videoId: string | null = useMemo(() => getYoutubeVideoId(story?.VideoUrl), [story]);

  return storyIsLoading ? null : (
    <Page>
      <H1>{story!.Title}</H1>
      <div className="story-details">
        <div className="story-details__left-column" style={{ width: leftColumnWidth }}>
          {videoId ? <YouTube videoId={videoId} opts={{ width: leftColumnWidth }} /> : null}
          <Share url={`/#/story/${story!.ID}`} />
          <Votes
            storyId={story!.ID}
            initialVote={{
              Upvotes: story!.Upvotes,
              Downvotes: story!.Downvotes,
              UserUpvoted: story!.UserUpvoted,
              UserDownvoted: story!.UserDownvoted
            }}
          />
          <LongText text={story!.Description} />
        </div>
        <div>
          <div className="story-info__author">
            {story!.ImageURL && (
              <img className="story-info__author__image" src={story!.ImageURL} alt={story!.Username} />
            )}
            <span>{story!.Username}</span>
          </div>
          {story!.City ? (
            <div className="story-details__city">
              <H5>Город/район:</H5>
              {story!.City}
            </div>
          ) : null}

          <div>
            <H5>Категория:</H5>
            {story!.Categories.map((cat: string) => (
              <Checkbox checked={true}>{cat}</Checkbox>
            ))}
          </div>

          <div>
            <H5>Как мне можно помочь</H5>
            <LongText text={story!.HelpInstructions} />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default StoryPage;
