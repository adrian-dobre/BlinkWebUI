import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axios = require('axios').default;

export type BaseServiceResponse = AxiosResponse;
export const BaseRequestCancelToken = axios.CancelToken;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseServiceClientError<T = any> = AxiosError<T>;

export class ResponseInterceptor {
    responseInterceptor: (response: BaseServiceResponse) => BaseServiceResponse;
    errorResponseInterceptor: (
        error: BaseServiceClientError
    ) => BaseServiceClientError;

    constructor(
        responseInterceptor: (response: BaseServiceResponse) => BaseServiceResponse,
        errorResponseInterceptor: (
            error: BaseServiceClientError
        ) => BaseServiceClientError
    ) {
        this.responseInterceptor = responseInterceptor;
        this.errorResponseInterceptor = errorResponseInterceptor;
    }
}

export class BaseServiceClient {
    baseUrl: string;
    responseInterceptors: ResponseInterceptor[] = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    withResponseInterceptor(interceptor: ResponseInterceptor): BaseServiceClient {
        this.responseInterceptors.push(interceptor);
        return this;
    }

    private baseRequest(
        config: AxiosRequestConfig
    ): Promise<BaseServiceResponse> {
        const axiosInstance = axios.create();

        this.responseInterceptors.forEach((responseInterceptor) => {
            axiosInstance.interceptors.response.use(
                responseInterceptor.responseInterceptor,
                responseInterceptor.errorResponseInterceptor
            );
        });

        return axiosInstance({
            ...config,
            headers: {
                ...(config.headers ?? {}),
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache'
            },
            baseURL: this.baseUrl
        });
    }

    get(path?: string, config: AxiosRequestConfig = {}): Promise<BaseServiceResponse> {
        return this.baseRequest({ ...config, url: path, method: 'GET' });
    }

    post(path?: string, config: AxiosRequestConfig = {}): Promise<BaseServiceResponse> {
        return this.baseRequest({ ...config, url: path, method: 'POST' });
    }
}
