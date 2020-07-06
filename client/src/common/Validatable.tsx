import { Tooltip, Intent, Position } from '@blueprintjs/core';
import React from 'react';
import { useLayout, Layout } from '../responsiveness/viewportContext';

const Validatable: React.FC<{ error?: string }> = ({ error, children }) => {
  const layout = useLayout();
  return (
    <Tooltip
      content={error}
      position={layout === Layout.Mobile ? Position.BOTTOM : Position.RIGHT}
      intent={Intent.DANGER}
      isOpen={error ? true : false}
    >
      {children}
    </Tooltip>
  );
};

export default Validatable;
