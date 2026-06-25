
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

        const requestConfig: ApiRequestConfig = {
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
            const response = await fetch(url.toString(), {
                method,
                headers: requestConfig.headers,
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : undefined,
            });

            const data: ApiResponse<T> = await response.json();

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

