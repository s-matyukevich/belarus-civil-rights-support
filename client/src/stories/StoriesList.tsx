import React, { useCallback, useState } from 'react';
import { Button, Card, H3, Intent, NonIdealState, H5 } from '@blueprintjs/core';
import Votes from '../common/Votes';
import Share from '../common/Share';
import { Story } from '../model';
import { useHistory } from 'react-router-dom';
import ResponsiveVideo from '../common/ResponsiveVideo';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import { Helmet } from 'react-helmet';

const DesktopStoryInfo: React.FC<{ story: Story; onShare: (index: number) => void; index: number }> = ({
  story,
  onShare,
  index
}) => {
  const history = useHistory();
  const openStory = useCallback(() => history.push(`/story/${story.ID}`), [history, story]);

  const contentHeight = '150px';

  const videoSize = { height: contentHeight, width: '200px' };

  return (
    <Card className="story-info" interactive={true} onClick={() => openStory()}>
      <ResponsiveVideo videoUrl={story.VideoUrl} className="story-info__video" options={videoSize} responsive={false} />

      <div className="story-info__description" style={{ maxHeight: contentHeight }}>
        <H3>{story.Title}</H3>
        <p className="story-info__description__text" dangerouslySetInnerHTML={{ __html: story.Description }}></p>
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
        <Share
          url={`/#/story/${story.ID}`}
          onShare={() => {
            onShare(index);
          }}
        />
      </div>
    </Card>
  );
};

const MobileStoryInfo: React.FC<{ story: Story }> = ({ story }) => {
  const history = useHistory();
  const openStory = useCallback(() => history.push(`/story/${story.ID}`), [history, story]);

  return (
    <Card interactive={true} onClick={() => openStory()}>
      <H5>{story.Title}</H5>
      <ResponsiveVideo videoUrl={story.VideoUrl} responsive={true} className="mobile-story-info__video" />
      <div className="mobile-story-info__author-and-votes">
        <div className="mobile-story-info__author">
          {story.AuthorImageURL && (
            <img className="mobile-story-info__author__image" src={story.AuthorImageURL} alt={story.AuthorName} />
          )}
          <span>{story.AuthorName}</span>
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
      </div>

      <div className="mobile-story-info__help">
        <Button intent={Intent.PRIMARY}>Помочь</Button>
      </div>
    </Card>
  );
};

const StoriesList: React.FC<{ stories: Story[] | null; onScroll: () => void }> = ({ stories, onScroll }) => {
  const layout = useLayout();
  const StoryInfo = layout === Layout.Mobile ? MobileStoryInfo : DesktopStoryInfo;
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

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
      <Helmet>
        <title>Дапамажы.by</title>
        <meta name="description" content={selectedStory?.Title} />
        <meta name="og:title" content={`Дапамажы свайму сябру: ${selectedStory?.AuthorName}`} />
        <meta name="og:image" content={selectedStory?.AuthorImageURL} />
        <meta property="og:url" content={selectedStory?.VideoUrl} />
        <meta property="og:video" content={selectedStory?.VideoUrl} />
        <meta property="og:video:type" content="application/x-shockwave-flash" />
      </Helmet>
      {(stories ?? []).map((story, idx) => (
        <StoryInfo
          story={story}
          key={story.ID}
          onShare={(index: number) => {
            if (stories) {
              setSelectedStory(stories[index]);
            }
          }}
          index={idx}
        />
      ))}
      {!stories ? <NonIdealState icon="search" title="По вашему запросу ничего не найдено" /> : null}
    </div>
  );
};

export default StoriesList;
