import YouTube from 'react-youtube';
import React, {useMemo} from 'react';
import {Button, Card, H3, Icon, Intent} from '@blueprintjs/core';
import {IconNames} from '@blueprintjs/icons';
import {Story} from '../model';

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
  },
  {
    id: 2,
    title: 'История №2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    upvotes: 120,
    downvotes: 14,
    authorName: 'Автор истории',
    authorId: 1,
    authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
  },
  {
    id: 3,
    title: 'История №3',
    videoUrl: 'https://www.youtube.com/watch?v=XyNlqQId-nk',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    upvotes: 120,
    downvotes: 14,
    authorName: 'Автор истории',
    authorId: 1,
    authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
  },
  {
    id: 4,
    title: 'История №4',
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

export default () => (
  <div className="stories-list">
    {stories.map(story => (
      <StoryInfo story={story} key={story.id} />
    ))}
  </div>
);
