import { useEffect, useState } from "react";
import { ProductsService } from "../services/productsService";
import type { ProductDetails, ColorOptions, StorageOptions } from "../types/products";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

const useDetails = (id: string) => {

    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorOptions | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<StorageOptions | null>(null);

    const { addToCart, isInCart } = useCart();

    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        setLoading(true);
        window.scrollTo(0, 0);
        try {
            const data = await ProductsService.getProductDetails(id);
            console.log("Fetched product details:", data);
            setProductDetails(data);
            if (data.colorOptions && data.colorOptions.length > 0) {
                setSelectedColor(data.colorOptions[0]);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Error fetching product details:", message);
            setError(message);
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedStorage) {
            setError("Please select a color and storage option.");
            return;
        }

        if (productDetails) {

            if (isInCart(productDetails.id)) {
                setError("This item is already in the cart.");
                return;
            }

            const cartItem = {
                ...productDetails,
                colorOptions: selectedColor,
                storageOptions: selectedStorage,
            };

            addToCart(cartItem);
            navigate('/cart');
        }
    }

    return {
        productDetails,
        loading,
        error,
        selectedColor,
        setSelectedColor,
        selectedStorage,
        setSelectedStorage,
        handleAddToCart,
        navigate
    };
}

export default useDetails;