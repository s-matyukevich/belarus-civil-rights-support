import YouTube from 'react-youtube';
import React, { useMemo } from 'react';
import { Button, H3, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

type Story = {
  id: number;
  videoUrl: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  authorName: string;
  authorId: number;
  authorImageURL?: string;
};

const stories: Story[] = [
  {
    id: 1,
    videoUrl: 'https://www.youtube.com/watch?v=XyNlqQId-nk',
    title: 'История №1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    upvotes: 120,
    downvotes: 14,
    authorName: 'Автор истории',
    authorId: 1,
    authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
  }
];

const StoryInfo: React.FC<{ story: Story }> = ({ story }) => {
  const videoId: string | null = useMemo(() => {
    if (story.videoUrl) {
      const url = new URL(story.videoUrl);
      return url.searchParams.get('v');
    }

    return null;
  }, [story]);

  return (
    <div className="story-info">
      {videoId ? (
        <div className="story-info__video" style={{ height: '150px', width: '200px' }}>
          <YouTube videoId={videoId} opts={{ height: '150px', width: '200px' }} />
        </div>
      ) : null}

      <div className="story-info__description">
        <H3>{story.title}</H3>
        <div>{story.description}</div>
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
    </div>
  );
};

export default () => (
  <div>
    {stories.map(story => (
      <StoryInfo story={story} key={story.id} />
    ))}
  </div>
);
