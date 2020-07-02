import { Tooltip, Intent, Position } from '@blueprintjs/core';
import React from 'react';

const Validatable: React.FC<{ error?: string }> = ({ error, children }) => {
  return error ? (
    <Tooltip content={error} position={Position.RIGHT} intent={Intent.DANGER} isOpen={true}>
      {children}
    </Tooltip>
  ) : (
    (children as any)
  );
};

export default Validatable;
