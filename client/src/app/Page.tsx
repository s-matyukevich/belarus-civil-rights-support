import Header from './Header';
import React, { ReactNode } from 'react';
import { useLayout, Layout } from '../responsiveness/viewportContext';
import cn from 'classnames';

type Props = {
  headerContent?: ReactNode;
};

const Page: React.FC<Props> = ({ children, headerContent }) => {
  const layout = useLayout();

  const classes = cn('page', {
    ['page--mobile']: layout === Layout.Mobile
  });

  return (
    <div className={classes}>
      <Header>{headerContent}</Header>
      <div className="page-content">{children}</div>
    </div>
  );
};

export default Page;
