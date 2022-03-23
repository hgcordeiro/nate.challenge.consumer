export type Product = {
  id: number;
  url: string;
  price: number;
  discountCode?: string;
}

export let products = [
  {
    id: 1,
    productUrl: "https://www.bedbathandbeyond.com/store/product/kate-spade-new-york-2-slice-toaster/5374432",
    productPrice: 9499,
    discountCode: "FREE5FROMNATE"
  },
  {
    id: 2,
    productUrl: "https://www.oculus.com/quest-2/",
    productPrice: 29900
  },
  {
    id: 3,
    productUrl: "https://www.apple.com/shop/product/MME73AM/A/airpods-3rd-generation",
    productPrice: 17900,
    discountCode: "GIVEME50"
  }
];

export const getProductById = (id: number) => {
  const product = products.find(p => p.id === id);

  return product;
};

export const getProducts = () => products;
