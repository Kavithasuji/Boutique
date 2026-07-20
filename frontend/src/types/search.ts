export interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: string;

  category: {
    id: string;
    name: string;
    slug: string;
  };

  colors: {
    imageUrl: string;
  }[];
}