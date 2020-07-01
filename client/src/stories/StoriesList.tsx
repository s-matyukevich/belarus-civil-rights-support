import YouTube from 'react-youtube';
import React, { useMemo } from 'react';
import { Button, Card, H3, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Story } from '../model';
import { getYoutubeVideoId } from '../common/utils';

const StoryInfo: React.FC<{ story: Story }> = ({ story }) => {
  const videoId: string | null = useMemo(() => getYoutubeVideoId(story.VideoUrl), [story]);

  const contentHeight = '150px';

  const videoSize = { height: contentHeight, width: '200px' };

  return (
    <Card className="story-info" interactive={true}>
      {videoId ? (
        <div className="story-info__video" style={videoSize}>
          <YouTube videoId={videoId} opts={videoSize} />
        </div>
      ) : null}

      <div className="story-info__description" style={{ maxHeight: contentHeight }}>
        <H3>{story.Title}</H3>
        <p className="story-info__description__text">{story.Description}</p>
      </div>

      <div className="story-info__controls">
        <div className="story-info__author">
          {story.AuthorImageURL && (
            <img className="story-info__author__image" src={story.AuthorImageURL} alt={story.AuthorName} />
          )}
          <span>{story.AuthorName}</span>
        </div>

        <div className="story-info__help">
          <Button intent={Intent.PRIMARY}>Помочь</Button>
        </div>

        <div className="story-info__social">
          <div className="story-info__social__reaction">
            <Icon icon={IconNames.THUMBS_UP} className="story-info__social__reaction__icon" />
            <span>{story.Upvotes}</span>
          </div>

          <div className="story-info__social__reaction">
            <Icon icon={IconNames.THUMBS_DOWN} className="story-info__social__reaction__icon" />
            <span>{story.Downvotes}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StoriesList: React.FC<{ stories: Story[] | null }> = ({ stories }) => {
  return (
    <div className="stories-list">
      {(stories ?? []).map(story => (
        <StoryInfo story={story} key={story.ID} />
      ))}
    </div>
  );
};

export default StoriesList;
