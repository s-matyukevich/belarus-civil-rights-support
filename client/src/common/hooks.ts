import { ReferenceData } from '../model';
import { DependencyList, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import ServicesContext from '../services/servicesContext';

export function usePromise<T>(f: () => Promise<T>, deps?: DependencyList): [true, null] | [false, T] {
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    f().then(setResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Array.from(deps ?? []), f]);

  return result === null ? [true, null] : [false, result];
}

export function useReferenceData(): [true, null] | [false, ReferenceData] {
  const services = useContext(ServicesContext);
  const fRef = useCallback(() => services.apiClient.getReferenceData(), [services]);
  return usePromise(fRef, []);
}

export type Selectable = { label: string; value: number };

export function useReferenceDataSelectors(): { cities: Selectable[]; categories: Selectable[] } {
  const [isLoading, refData] = useReferenceData();

  return useMemo(
    () =>
      isLoading
        ? {
            cities: [],
            categories: []
          }
        : {
            cities: refData!.cities.map(city => ({ label: city.Title, value: city.ID })),
            categories: refData!.categories.map(category => ({ label: category.Title, value: category.ID }))
          },
    [isLoading, refData]
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
