import React, { useContext } from 'react';

export type Viewport = {
  width: number;
  height: number;
};

export enum Layout {
  Desktop = 'desktop',
  Mobile = 'mobile'
}

const threshold = 662;

export const ViewportContext = React.createContext<Viewport>({
  height: window.innerHeight,
  width: window.innerWidth
});

export function useViewport(): Viewport {
  return useContext(ViewportContext);
}

export function useLayout(): Layout {
  const viewport = useViewport();
  return viewport.width < threshold ? Layout.Mobile : Layout.Desktop;
}
