import React, { useEffect } from 'react';
import { ViewportContext } from './viewportContext';

const ViewportProvider: React.FC = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return <ViewportContext.Provider value={{ width, height }}>{children}</ViewportContext.Provider>;
};

export default ViewportProvider;