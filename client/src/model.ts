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
