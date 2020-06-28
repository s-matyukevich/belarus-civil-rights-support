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
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

export type ReferenceData = {
  cities: City[];
  categories: Category[];
};

export type User = {
  id: number;
  name: string;
  imageUrl: string;
};

export type LoginProvider = {
  auth_url: string;
  client_id: string;
  image: string;
  name: string;
  redirect_url: string;
  scope?: string;
};
