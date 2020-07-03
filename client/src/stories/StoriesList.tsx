import YouTube from 'react-youtube';
import React, { useMemo, useCallback } from 'react';
import { Button, Card, H3, Intent } from '@blueprintjs/core';
import Votes from '../common/Votes';
import Share from '../common/Share';
import { Story } from '../model';
import { getYoutubeVideoId } from '../common/utils';
import { useHistory } from 'react-router-dom';

const StoryInfo: React.FC<{ story: Story }> = ({ story }) => {
  const videoId: string | null = useMemo(() => getYoutubeVideoId(story.VideoUrl), [story]);
  const history = useHistory();
  const openStory = useCallback(() => history.push(`/story/${story.ID}`), [history, story]);

  const contentHeight = '150px';

  const videoSize = { height: contentHeight, width: '200px' };

  return (
    <Card className="story-info" interactive={true} onClick={() => openStory()}>
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

        <Votes
          storyId={story.ID}
          initialVote={{
            Upvotes: story.Upvotes,
            Downvotes: story.Downvotes,
            UserUpvoted: story.UserUpvoted,
            UserDownvoted: story.UserDownvoted
          }}
        />
        <Share url={`/#/story/${story.ID}`} />
      </div>
    </Card>
  );
};

const StoriesList: React.FC<{ stories: Story[] | null; onScroll: () => void }> = ({ stories, onScroll }) => {
  return (
    <div
      className="stories-list"
      onScroll={e => {
        const element = e.currentTarget;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
          onScroll();
        }
      }}
    >
      {(stories ?? []).map(story => (
        <StoryInfo story={story} key={story.ID} />
      ))}
    </div>
  );
};

export default StoriesList;
