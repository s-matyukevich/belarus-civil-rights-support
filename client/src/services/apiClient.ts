import { LoginProvider, ReferenceData, Story } from '../model';

export default class ApiClient {
  private readonly apiBasePath: string;

  constructor() {
    this.apiBasePath = process.env.API_BASE_PATH ?? window.location.origin + window.location.pathname;
    if (this.apiBasePath.endsWith('/')) {
      this.apiBasePath = this.apiBasePath.substring(0, this.apiBasePath.length - 1);
    }
  }

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

  public getStories(): Promise<Story[]> {
    return Promise.resolve([
      {
        id: 1,
        videoUrl: 'https://www.youtube.com/watch?v=XyNlqQId-nk',
        title: 'История №1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        upvotes: 120,
        downvotes: 14,
        authorName: 'Автор истории',
        authorId: 1,
        authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
      },
      {
        id: 2,
        title: 'История №2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        upvotes: 120,
        downvotes: 14,
        authorName: 'Автор истории',
        authorId: 1,
        authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
      },
      {
        id: 3,
        title: 'История №3',
        videoUrl: 'https://www.youtube.com/watch?v=XyNlqQId-nk',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        upvotes: 120,
        downvotes: 14,
        authorName: 'Автор истории',
        authorId: 1,
        authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
      },
      {
        id: 4,
        title: 'История №4',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        upvotes: 120,
        downvotes: 14,
        authorName: 'Автор истории',
        authorId: 1,
        authorImageURL: 'https://graph.facebook.com/v3.3/4595976050428239/picture?type=normal'
      }
    ]);
  }

  // TODO memoize
  public async getLoginProviders(): Promise<LoginProvider[]> {
    const response = await fetch(`${this.apiBasePath}/get-login-providers`);
    return response.json();
  }
}
