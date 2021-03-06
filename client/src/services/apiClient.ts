import {
  LoginProvider,
  ReferenceData,
  Story,
  StoryDetails,
  Filters,
  User,
  StoryModel,
  Status,
  Vote,
  ProfileModel,
  MyStoryModel,
  PaymentModel,
  ContactUs
} from '../model';
import { Intent } from '@blueprintjs/core';
import querystring from 'query-string';
import fetchIntercept from 'fetch-intercept';
import { Toaster } from '@blueprintjs/core';

fetchIntercept.register({
  response(response) {
    response
      .clone()
      .json()
      .then(status => {
        if (status && status.error) {
          Toaster.create().show({
            message: 'Ошибка сервера: ' + status.error,
            intent: Intent.DANGER
          });
        }
      });
    return response;
  }
});

export default class ApiClient {
  private readonly apiBasePath: string;

  constructor() {
    this.apiBasePath = process.env.API_BASE_PATH ?? window.location.origin;
    if (this.apiBasePath.endsWith('/')) {
      this.apiBasePath = this.apiBasePath.substring(0, this.apiBasePath.length - 1);
    }
  }

  // TODO memoize
  public async getReferenceData(): Promise<ReferenceData> {
    return Promise.all([fetch(`${this.apiBasePath}/get-cities`), fetch(`${this.apiBasePath}/get-categories`)]).then(
      async ([citiesResp, categoriesResp]) => {
        const cities = await citiesResp.json();
        const categories = await categoriesResp.json();
        return { cities, categories };
      }
    );
  }

  public async getStories(filters: Filters): Promise<Story[]> {
    const str = querystring.stringify(filters);
    const response = await fetch(`${this.apiBasePath}/home/stories?` + str);
    return response.json();
  }

  public async getStoryModel(id: number | undefined): Promise<StoryModel> {
    if (id === undefined) {
      return Promise.resolve({
        ID: 0,
        Title: '',
        Categories: [],
        Description: '',
        HelpInstructions: '',
        VideoUrl: '',
        CityID: 0,
        IsDraft: false,
        PaymentEmail: '',
        PhoneEnabled: false,
        PaymentPhone: '',
        CardEnabled: false,
        CardLink: '',
        CardRawEnabled: false,
        CardRaw: '',
        MGEnabled: false,
        PaymentFirstName: '',
        PaymentLastName: '',
        WUEnabled: false,
        PaymentAddress: ''
      });
    }
    const response = await fetch(`${this.apiBasePath}/add-story/get?id=` + id);
    return response.json();
  }

  public async getProfile(): Promise<ProfileModel> {
    const response = await fetch(`${this.apiBasePath}/profile/get`);
    return response.json();
  }

  public async getStoryDetails(id: number): Promise<StoryDetails> {
    const response = await fetch(`${this.apiBasePath}/get-story-details/` + id);
    return response.json();
  }

  public async getMyStories(): Promise<MyStoryModel[]> {
    const response = await fetch(`${this.apiBasePath}/get-my-stories`);
    return response.json();
  }
  // TODO memoize
  public async getLoginProviders(): Promise<LoginProvider[]> {
    const response = await fetch(`${this.apiBasePath}/get-login-providers`);
    return response.json();
  }

  public async getLoggedUser(): Promise<User | null> {
    const response = await fetch(`${this.apiBasePath}/logged-user`);
    const user = await response.json();

    return user.ID ? user : null;
  }

  public logout() {
    window.location.assign(`${this.apiBasePath}/logout`);
  }

  public async addStory(story: StoryModel): Promise<Status> {
    const response = await fetch(`${this.apiBasePath}/add-story/save`, {
      method: 'POST',
      body: JSON.stringify(story),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  public async submitPayment(payment: PaymentModel): Promise<Status> {
    const response = await fetch(`${this.apiBasePath}/submit-payment`, {
      method: 'POST',
      body: JSON.stringify(payment),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  public async contactUs(payment: ContactUs): Promise<Status> {
    const response = await fetch(`${this.apiBasePath}/contact-us`, {
      method: 'POST',
      body: JSON.stringify(payment),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  public async deleteStory(id: number): Promise<Status> {
    const response = await fetch(`${this.apiBasePath}/delete-my-stories?id=` + id, {
      method: 'POST'
    });

    return response.json();
  }

  public async saveProfile(profile: ProfileModel): Promise<Status> {
    const response = await fetch(`${this.apiBasePath}/profile/save`, {
      method: 'POST',
      body: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  public async vote(storyId: number, isUpvote: boolean): Promise<Vote> {
    const response = await fetch(`${this.apiBasePath}/vote`, {
      method: 'POST',
      body: JSON.stringify({ StoryID: storyId, IsUpvote: isUpvote }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
