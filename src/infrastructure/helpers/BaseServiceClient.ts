/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import SimplePubSub, { PubSubEvent } from '../../application/utils/SimplePubSub';

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

        SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_STARTED, axiosInstance);

        return axiosInstance({
            ...config,
            headers: {
                ...(config.headers ?? {}),
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache'
            },
            baseURL: this.baseUrl
        })
            .then((response: AxiosResponse) => {
                SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_SUCCESS, response);
                SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_ENDED, response);
                return response;
            })
            .catch((reason: AxiosError) => {
                SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_FAILED, reason);
                SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_ENDED, reason);
                if (reason.response && [401, 403].includes(reason.response.status)) {
                    SimplePubSub.publish(PubSubEvent.HTTP_REQUEST_UNAUTHORIZED, reason);
                }
                throw reason;
            });
    }

    get(path?: string, config: AxiosRequestConfig = {}): Promise<BaseServiceResponse> {
        return this.baseRequest({ ...config, url: path, method: 'GET' });
    }

    post(path?: string, config: AxiosRequestConfig = {}): Promise<BaseServiceResponse> {
        return this.baseRequest({ ...config, url: path, method: 'POST' });
    }

    put(path?: string, config: AxiosRequestConfig = {}): Promise<BaseServiceResponse> {
        return this.baseRequest({ ...config, url: path, method: 'PUT' });
    }
}
