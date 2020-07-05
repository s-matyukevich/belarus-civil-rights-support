import { H1, H5, Checkbox } from '@blueprintjs/core';
import React from 'react';
import Page from '../app/Page';
import { useParams } from 'react-router-dom';
import { useServices, usePromise } from '../common/hooks';
import './StoryDetails.css';
import Votes from '../common/Votes';
import Share from '../common/Share';
import { FacebookIcon, VKIcon, OKIcon } from 'react-share';
import ResponsiveVideo from '../common/ResponsiveVideo';

const LongText: React.FC<{ text: string }> = ({ text }) => (
  <div className="story-details__description" dangerouslySetInnerHTML={{ __html: text }}></div>
);

const StoryPage: React.FC = () => {
  const { id } = useParams();
  const services = useServices();
  const [storyIsLoading, story] = usePromise(() => services.apiClient.getStoryDetails(id), [id]);

  return storyIsLoading ? null : (
    <Page>
      <H1>{story!.Title}</H1>
      <div className="story-details">
        <div className="story-details__left-column">
          <ResponsiveVideo videoUrl={story!.VideoUrl} responsive={true} />
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
              <Checkbox key={cat} checked={true}>
                {cat}
              </Checkbox>
            ))}
          </div>
          {story!.Email || story!.Phone ? (
            <div className="story-details__contacts">
              <H5>Мои контакты:</H5>
              {story!.Email ? (
                <p>
                  <b>Емейл: </b>
                  {story!.Email}
                </p>
              ) : null}
              {story!.Phone ? (
                <p>
                  <b>Телефон: </b>
                  {story!.Phone}
                </p>
              ) : null}
            </div>
          ) : null}
          {story!.SocialLinks ? (
            <div className="story-details__social">
              <H5>Мои контакты в соц сетях:</H5>
              {story!.SocialLinks.map(x => (
                <p key={x}>
                  <a href={x} target="_blank">
                    {x.includes('facebook.com') ? <FacebookIcon size={25} borderRadius={15} /> : null}
                    {x.includes('vk.com') ? <VKIcon size={25} borderRadius={15} /> : null}
                    {x.includes('ok.ru') ? <OKIcon size={25} borderRadius={15} /> : null}
                    {x}
                  </a>
                </p>
              ))}
            </div>
          ) : null}

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
