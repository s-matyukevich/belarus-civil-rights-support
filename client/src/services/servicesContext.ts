import ApiClient from './apiClient';
import React from 'react';
import { IToaster, Toaster } from '@blueprintjs/core';

type Services = {
  apiClient: ApiClient;
  toaster: IToaster;
};

const ServicesContext = React.createContext<Services>({
  apiClient: new ApiClient(),
  toaster: Toaster.create()
});

export default ServicesContext;
