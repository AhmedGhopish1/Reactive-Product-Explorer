export interface Product {
     id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export type searchState = | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };
                          // {status:'retrying'};


 export type SortOption = 'name-AtoZ' | 'name-ZtoA' | 'price-asc' | 'price-desc';
