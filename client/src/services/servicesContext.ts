import ApiClient from './apiClient';
import React from 'react';

type Services = {
  apiClient: ApiClient;
};

const ServicesContext = React.createContext<Services>({
  apiClient: new ApiClient()
});

export default ServicesContext;
