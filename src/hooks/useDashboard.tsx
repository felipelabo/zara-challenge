import { useEffect, useRef, useState } from "react";
import { ProductsService } from "../services/productsService";
import type { Product } from "../types/products";

const useDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchProducts = async (query: string = "") => {

        setLoading(true);
        try {
            const data = await ProductsService.getProducts(20, 0, query);
            setProducts(data);
            setError(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleSearch = (query: string) => {

        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchProducts(query);
        }, 350);
    };



    return {
        products,
        loading,
        error,
        handleSearch,
        searchQuery
    };
}

export default useDashboard;