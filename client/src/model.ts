export type Story = {
  ID: number;
  VideoUrl: string;
  Title: string;
  Description: string;
  Upvotes: number;
  Downvotes: number;
  UserUpvoted: boolean;
  UserDownvoted: boolean;
  AuthorName: string;
  AuthorId: number;
  AuthorImageURL: string;
};

export type Filters = {
  Search: string;
  Cities: number[];
  Categories: number[];
  Page: number;
  SortColumn: string;
  SortDirection: string;
};

type City = {
  ID: number;
  Title: string;
};

type Category = {
  ID: number;
  Title: string;
};

export type ReferenceData = {
  cities: City[];
  categories: Category[];
};

export type User = {
  ID: number;
  Username: string;
  ImageURL: string;
};

export type LoginProvider = {
  auth_url: string;
  client_id: string;
  image: string;
  name: string;
  redirect_url: string;
  scope?: string;
  response_type?: string;
};

export type StoryModel = {
  ID: number;
  Title: string;
  Description: string;
  VideoUrl: string;
  HelpInstructions: string;
  Categories: number[];
  CityID?: number;
  IsDraft: boolean;
  PaymentEmail: string;
  PaymentFirstName: string;
  PaymentLastName: string;
  PaymentAddress: string;
  PaymentPhone: string;
  PhoneEnabled: boolean;
  CardEnabled: boolean;
  CardLink: string;
  CardRawEnabled: boolean;
  CardRaw: string;
  MGEnabled: boolean;
  WUEnabled: boolean;
};

export type StoryDetails = {
  ID: number;
  Title: string;
  Description: string;
  VideoUrl: string;
  HelpInstructions: string;
  Username: string;
  ImageURL: string;
  Email: string;
  Phone: string;
  SocialLinks: string[];
  City: string;
  Categories: string[];
  UserUpvoted: boolean;
  UserDownvoted: boolean;
  Upvotes: number;
  Downvotes: number;
  PaymentEmail: string;
  PaymentFirstName: string;
  PaymentLastName: string;
  PaymentAddress: string;
  PaymentPhone: string;
  PhoneEnabled: boolean;
  CardEnabled: boolean;
  CardLink: string;
  CardRawEnabled: boolean;
  CardRaw: string;
  MGEnabled: boolean;
  WUEnabled: boolean;
};

export type PaymentModel = {
  Amount: string;
  Type: string;
  Currency: string;
  Email: string;
  ReferenceNumber: string;
  StoryID: number;
};

export type Status = {
  ID: number;
  Errors: Record<string, string> | null;
  Success: string;
};

export type Vote = {
  UserUpvoted: boolean;
  UserDownvoted: boolean;
  Upvotes: number;
  Downvotes: number;
};

export type ProfileModel = {
  ID: number;
  Username: string;
  ImageURL: string;
  Email: string;
  Phone: string;
  SocialLinks: string[];
};

export type MyStoryModel = {
  ID: number;
  Title: string;
};

export type ContactUs = {
  Message: string;
  Email: string;
};
