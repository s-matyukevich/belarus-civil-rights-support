import { H1, H5, Checkbox, Popover, Menu, Button, Intent } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { IconNames } from '@blueprintjs/icons';
import Page from '../app/Page';
import { useParams } from 'react-router-dom';
import { useServices } from '../common/hooks';
import './StoryDetails.scss';
import Votes from '../common/Votes';
import Share from '../common/Share';
import { FacebookIcon, VKIcon, OKIcon } from 'react-share';
import ResponsiveVideo from '../common/ResponsiveVideo';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import { StoryDetails } from '../model';
import PaymentDialog from './PaymentDialog';

const LongText: React.FC<{ text: string }> = ({ text }) => (
  <div className="story-details__description" dangerouslySetInnerHTML={{ __html: text }}></div>
);

const StoryPage: React.FC = () => {
  const { id } = useParams();
  const services = useServices();
  const [story, setStory] = useState({} as StoryDetails);
  const [paymentType, setPaymentType] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    services.apiClient.getStoryDetails(id).then(remoteStory => setStory(prev => ({ ...prev, ...remoteStory })));
  }, [id, services]);
  const layout = useLayout();

  return !story.ID ? null : (
    <Page>
      <PaymentDialog
        type={paymentType}
        story={story}
        dialogIsOpen={dialogOpen}
        setDialogIsOpen={setDialogOpen}
      ></PaymentDialog>
      <H1>{story!.Title}</H1>
      <div className={layout === Layout.Mobile ? 'story-details' : 'story-details desctop'}>
        <div className="story-details__left-column">
          <ResponsiveVideo videoUrl={story!.VideoUrl} responsive={true} />
          <Share url={`/story/${story!.ID}`} />
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
          <div className="youtube-redirect">
            <Button
              onClick={() => (window.location.href = story!.VideoUrl)}
              large={true}
              intent={Intent.PRIMARY}
              text="Оставить коментарий на Youtube"
            />
          </div>
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
                  <a href={x} target="_blank" rel="noopener noreferrer">
                    {x.includes('facebook.com') ? <FacebookIcon size={25} borderRadius={15} /> : null}
                    {x.includes('vk.com') ? <VKIcon size={25} borderRadius={15} /> : null}
                    {x.includes('ok.ru') ? <OKIcon size={25} borderRadius={15} /> : null}
                    {x}
                  </a>
                </p>
              ))}
            </div>
          ) : null}
          {story!.PhoneEnabled ||
          story!.CardEnabled ||
          story!.MGEnabled ||
          story!.WUEnabled ||
          story!.CardRawEnabled ? (
            <div>
              <Popover
                position="bottom-right"
                content={
                  <Menu>
                    {story!.PhoneEnabled ? (
                      <Menu.Item
                        text="По номеру телефона (работает только в РБ)"
                        icon={IconNames.PHONE}
                        onClick={() => {
                          setPaymentType('phone');
                          setDialogOpen(true);
                        }}
                      />
                    ) : null}
                    {story!.CardEnabled ? (
                      <Menu.Item
                        text="На карту через секретную ссылку (работает только в РБ)"
                        icon={IconNames.CREDIT_CARD}
                        onClick={() => {
                          setPaymentType('card');
                          setDialogOpen(true);
                        }}
                      />
                    ) : null}
                    {story!.CardRawEnabled ? (
                      <Menu.Item
                        text="На карту напрямую (работает только в РБ)"
                        icon={IconNames.CREDIT_CARD}
                        onClick={() => {
                          setPaymentType('cardraw');
                          setDialogOpen(true);
                        }}
                      />
                    ) : null}
                    {story!.MGEnabled ? (
                      <Menu.Item
                        text="Через MoneyGram (подходит для переводов из-за границы)"
                        icon={IconNames.DOLLAR}
                        onClick={() => {
                          setPaymentType('mg');
                          setDialogOpen(true);
                        }}
                      />
                    ) : null}
                    {story!.WUEnabled ? (
                      <Menu.Item
                        text="Через WesternUnion (подходит для переводов из-за границы)"
                        icon={IconNames.GLOBE}
                        onClick={() => {
                          setPaymentType('wu');
                          setDialogOpen(true);
                        }}
                      />
                    ) : null}
                  </Menu>
                }
              >
                <Button large={true} intent={Intent.PRIMARY} text="Перевести деньги" rightIcon="caret-down" />
              </Popover>
            </div>
          ) : null}
          {story!.HelpInstructions ? (
            <div>
              <H5>Как eще мне можно помочь</H5>
              <LongText text={story!.HelpInstructions} />
            </div>
          ) : null}
        </div>
      </div>
    </Page>
  );
};

export default StoryPage;
