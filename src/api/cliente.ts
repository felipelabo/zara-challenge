
import { api_config } from './config.ts';
import type { ApiResponse, ApiRequestConfig } from './types.ts';

export class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(
        baseUrl: string = api_config.baseUrl,
        defaultHeaders: Record<string, string> = api_config.defaultHeaders
    ) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
    }

    public async get<T = unknown>(
        endpoint: string,
        config?: Partial<ApiRequestConfig>
    ): Promise<T> {
        return this.request<T>('GET', endpoint, config);
    }

    private async request<T = unknown>(
        method: string,
        endpoint: string,
        config?: Partial<ApiRequestConfig>
    ): Promise<T> {

        let requestConfig: ApiRequestConfig = {
            headers: {
                ...this.defaultHeaders,
                ...(config?.headers || {}),
            },
            params: config?.params,
            body: config?.body,
            timeout: config?.timeout,
        };

        const url = new URL(`${this.baseUrl}${endpoint}`);

        try {
            console.log(`Making ${method} request to:`, url.toString());
            const response = await fetch(url.toString(), {
                method,
                headers: requestConfig.headers,
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : undefined,
            });

            console.log(`Received response with status: ${response.status}`);

            const data: ApiResponse<T> = await response.json();

            console.log('API response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data as T;
        }
        catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
}

export const apiClient = new ApiClient();

