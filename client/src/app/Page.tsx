import Header from './Header';
import React, { ReactNode } from 'react';

type Props = {
  headerContent?: ReactNode;
};

const Page: React.FC<Props> = ({ children, headerContent }) => (
  <div className="page">
    <Header>{headerContent}</Header>
    <div className="page-content">{children}</div>
  </div>
);

export default Page;
