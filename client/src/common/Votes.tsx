import React, { useState, useCallback, useContext } from 'react';
import { Vote } from '../model';
import { IconNames } from '@blueprintjs/icons';
import { Icon, Intent } from '@blueprintjs/core';
import ServicesContext from '../services/servicesContext';

const Votes: React.FC<{ storyId: number; initialVote: Vote }> = ({ storyId, initialVote }) => {
  const services = useContext(ServicesContext);
  const [vote, setVote] = useState<Vote>(initialVote);

  const makeVote = useCallback((evt, isUpvote: boolean) => {
    services.apiClient.vote(storyId, isUpvote).then(data => setVote(data));
    evt.stopPropagation();
  }, []);

  return (
    <div className="story-info__social">
      <div className="story-info__social__reaction">
        <Icon
          icon={IconNames.THUMBS_UP}
          iconSize={20}
          intent={vote.UserUpvoted ? Intent.PRIMARY : Intent.NONE}
          className="story-info__social__reaction__icon"
          onClick={evt => makeVote(evt, true)}
        />
        <span className="story-info__social__reaction__votes">{vote.Upvotes}</span>
      </div>

      <div className="story-info__social__reaction">
        <Icon
          icon={IconNames.THUMBS_DOWN}
          iconSize={20}
          intent={vote.UserDownvoted ? Intent.PRIMARY : Intent.NONE}
          className="story-info__social__reaction__icon"
          onClick={evt => makeVote(evt, false)}
        />
        <span className="story-info__social__reaction__votes">{vote.Downvotes}</span>
      </div>
    </div>
  );
};

export default Votes;
