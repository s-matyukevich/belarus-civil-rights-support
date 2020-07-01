import { H4, H5, Checkbox } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import Page from '../app/Page';
import { useParams } from 'react-router-dom';
import { useServices, usePromise, useReferenceData } from '../common/hooks';
import { getYoutubeVideoId } from '../common/utils';
import YouTube from 'react-youtube';
import './StoryDetails.css';

const leftColumnWidth = '650px';

const LongText: React.FC<{text: string}> = ({text}) => (
  <div>
    {text.split('\n').map(line => (
      <p>{line}</p>
    ))}
  </div>
);

const StoryPage: React.FC = () => {
  const { id } = useParams();
  const services = useServices();
  const [refDataIsLoading, refData] = useReferenceData()
  const [storyIsLoading, story] = usePromise(() => services.apiClient.getStoryModel(id), [id]);
  const videoId: string | null = useMemo(() => getYoutubeVideoId(story?.VideoUrl), [story]);
  const categories = useMemo(
    () => (refData && story ? refData.categories.filter(cat => story.Categories.indexOf(cat.ID) >= 0) : []),
    [refData, story]
  );

  return storyIsLoading || refDataIsLoading ? null : (
    <Page>
      <H4>{story!.Title}</H4>
      <div className="story-details">
        <div className="story-details__left-column" style={{ width: leftColumnWidth }}>
          {videoId ? <YouTube videoId={videoId} opts={{ width: leftColumnWidth }} /> : null}
          <LongText text={story!.Description}/>
        </div>
        <div>
          {story!.CityID ? (
            <div className="story-details__city">
              Город/район: {refData?.cities.find(city => city.ID === story?.CityID)?.Title}
            </div>
          ) : null}

          {categories.length > 0 ? (
            <div>
              {categories.map(cat => (
                <Checkbox checked={true} key={cat.ID}>
                  {cat.Title}
                </Checkbox>
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
