import React, { useContext, useState, useEffect } from 'react';
import ServicesContext from '../services/servicesContext';
import { ITreeNode, Tree, Classes, Tooltip, Icon, Intent, H2 } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import Page from '../app/Page';

const MyStories: React.FC = () => {
  const history = useHistory();
  const services = useContext(ServicesContext);
  const [items, setItems] = useState<ITreeNode[]>([]);

  useEffect(() => {
    services.apiClient.getMyStories().then(data => {
      const newItems = data.map(x => {
        return {
          id: x.ID,
          icon: 'document',
          label: x.Title,
          secondaryLabel: (
            <Tooltip content="Удалить историю">
              <Icon icon="trash" intent={Intent.DANGER} />
            </Tooltip>
          )
        } as ITreeNode;
      });
      setItems(newItems);
    });
  }, []);

  const handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
    history.push(`/edit-story/${nodeData.id}`);
  };
  return (
    <Page>
      <H2>Мои истории</H2>
      <div className="my-stories">
        <Tree contents={items} onNodeClick={handleNodeClick} className={Classes.ELEVATION_0} />
      </div>
    </Page>
  );
};

export default MyStories;
