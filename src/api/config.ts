
export const getBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
    return baseUrl;
}

export const api_config = {
    baseUrl: getBaseUrl(),
    defaultHeaders: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY || ''
    },
    endpoints: {
        products: '/products',
        productDetails: `/products/:id`,
    },
};