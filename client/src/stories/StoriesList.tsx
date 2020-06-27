import YouTube from 'react-youtube';
import React, { useContext, useMemo } from 'react';
import { Button, Card, H3, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Story } from '../model';
import ServicesContext from '../services/servicesContext';
import { usePromise } from '../common/hooks';

const StoryInfo: React.FC<{ story: Story }> = ({ story }) => {
  const videoId: string | null = useMemo(() => {
    if (story.videoUrl) {
      const url = new URL(story.videoUrl);
      return url.searchParams.get('v');
    }

    return null;
  }, [story]);

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
        <H3>{story.title}</H3>
        <p className="story-info__description__text">{story.description}</p>
      </div>

      <div className="story-info__controls">
        <div className="story-info__author">
          {story.authorImageURL && (
            <img className="story-info__author__image" src={story.authorImageURL} alt={story.authorName} />
          )}
          <span>{story.authorName}</span>
        </div>

        <div className="story-info__help">
          <Button intent={Intent.PRIMARY}>Помочь</Button>
        </div>

        <div className="story-info__social">
          <div className="story-info__social__reaction">
            <Icon icon={IconNames.THUMBS_UP} className="story-info__social__reaction__icon" />
            <span>{story.upvotes}</span>
          </div>

          <div className="story-info__social__reaction">
            <Icon icon={IconNames.THUMBS_DOWN} className="story-info__social__reaction__icon" />
            <span>{story.downvotes}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StoriesList: React.FC = () => {
  const services = useContext(ServicesContext);
  const [, stories] = usePromise(() => services.apiClient.getStories(), []);

  return (
    <div className="stories-list">
      {(stories ?? []).map(story => (
        <StoryInfo story={story} key={story.id} />
      ))}
    </div>
  );
};

export default StoriesList;
