import Header from './Header';
import React from 'react';

const Page: React.FC = ({ children }) => (
  <div className="page">
    <Header />
    <div className="page-content">{children}</div>
  </div>
);

export default Page;
