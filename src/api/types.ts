export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    body?: unknown;
    timeout?: number;
    skipUnauthorizedHandler?: boolean;
}