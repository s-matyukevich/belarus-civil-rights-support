export type Story = {
  id: number;
  videoUrl?: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  authorName: string;
  authorId: number;
  authorImageURL?: string;
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
};

export type AddStoryModel = {
  ID: number;
  Title: string;
  Description: string;
  VideoUrl: string;
  HelpInstructions: string;
  Categories: number[];
};
