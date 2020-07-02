import { Tooltip, Intent, Position } from '@blueprintjs/core';
import React from 'react';

const Validatable: React.FC<{ error?: string }> = ({ error, children }) => {
  return (
    <Tooltip content={error} position={Position.RIGHT} intent={Intent.DANGER} isOpen={error ? true : false}>
      {children}
    </Tooltip>
  );
};

export default Validatable;
