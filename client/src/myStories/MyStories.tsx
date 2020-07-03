import React, { useContext, useState, useEffect } from 'react';
import ServicesContext from '../services/servicesContext';
import { ITreeNode, Tree, Classes, ButtonGroup, Button, Intent, H2, H5, Dialog } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import Page from '../app/Page';
import './MyStories.css';

const MyStories: React.FC = () => {
  const history = useHistory();
  const services = useContext(ServicesContext);
  const [items, setItems] = useState<ITreeNode[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [storyIdToDelete, setStoryIdToDelete] = useState<number>(0);

  const updateStories = () => {
    services.apiClient.getMyStories().then(data => {
      const newItems = data.map(x => {
        return {
          id: x.ID,
          icon: 'document',
          label: x.Title,
          secondaryLabel: (
            <ButtonGroup minimal={true}>
              <Button
                icon="edit"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  history.push(`/edit-story/${x.ID}`);
                }}
              ></Button>
              <Button
                intent={Intent.DANGER}
                icon="trash"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setStoryIdToDelete(x.ID);
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              ></Button>
            </ButtonGroup>
          )
        } as ITreeNode;
      });
      setItems(newItems);
    });
  };

  useEffect(updateStories, []);

  const handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
    history.push(`/story/${nodeData.id}`);
  };
  return (
    <Page>
      <div className="my-stories">
        <H2>Мои истории</H2>
        <Tree contents={items} onNodeClick={handleNodeClick} className={Classes.ELEVATION_0} />
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={Classes.DIALOG_BODY}>
          <H5> Вы действительно хотите удалить историю?</H5>
          <br />
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent={Intent.DANGER}
              onClick={() => {
                services.apiClient.deleteStory(storyIdToDelete).then(status => {
                  services.toaster.show({
                    message: status.Success,
                    intent: Intent.SUCCESS
                  });
                  updateStories();
                });
                setIsOpen(false);
              }}
            >
              Удалить
            </Button>
            <Button onClick={() => setIsOpen(false)}>Отмена</Button>
          </div>
        </div>
      </Dialog>
    </Page>
  );
};

export default MyStories;
