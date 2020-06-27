import { ReferenceData } from '../model';

export default class ApiClient {
  // TODO memoize
  public getReferenceData(): Promise<ReferenceData> {
    return Promise.resolve({
      cities: ['Минск', 'Брест', 'Витебск', 'Гомель', 'Гродно', 'Могилёв'].map((name, id) => ({ name, id })),
      categories: ['Нуждаюсь в финансовой поддержке', 'Ищу новую работу', 'Ищу единомышленников'].map((name, id) => ({
        name,
        id
      }))
    });
  }
}
