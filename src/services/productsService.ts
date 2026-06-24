
import { apiClient } from "../api/cliente";
import { api_config } from "../api/config";
import type { Product, ProductDetails } from "../types/products";

export class ProductsService {

    // Obtener la lista de productos
    static async getProducts(
        limit: number = 100,
        offset: number = 0,
        search: string
    ): Promise<Product[]> {
        const endpoint = api_config.endpoints.products;
        const params: Record<string, string> = {
            limit: limit.toString(),
            offset: offset.toString(),
        };

        if (search) {
            params.search = search;
        }

        const newEndpoint = `${endpoint}?${new URLSearchParams(params).toString()}`;
        const products = await apiClient.get<Product[]>(newEndpoint);
        const cleanedProducts = Array.from(
            new Map(products.map((product) => [product.id, product])).values()
        )
        return cleanedProducts;
    }

    // Obtener los detalles de un producto por su ID
    static async getProductDetails(id: string): Promise<ProductDetails> {
        const endpoint = api_config.endpoints.productDetails.replace(':id', id);
        const productDetails = await apiClient.get<ProductDetails>(endpoint);
        return productDetails;
    }
}

