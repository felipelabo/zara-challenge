
export type Product = {
    id: string;
    brand: string;
    name: string;
    basePrice: number;
    imageUrl: string;
};

export type Specs = {
    [key: string]: string;
}
export type ColorOptions = {
    name: string;
    hexCode: string;
    imageUrl: string
}
export type StorageOptions = {
    capacity: string;
    price: number;
}

export type ProductDetails = {
    id: string;
    brand: string;
    name: string;
    description: string;
    basePrice: number;
    rating: number;
    specs: Specs;
    colorOptions: ColorOptions[];
    storageOptions: StorageOptions[];
    similarProducts: Product[];
}