import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing: boolean = false;

let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

function clearAuthTokensAndRedirect() {
  localStorage.clear();
  window.location.href = '/';
}

const NO_AUTH_ENDPOINTS = ['/token/', '/register/'];
const NO_RETRY_ENDPOINTS = ['/token/', '/token/refresh/', '/register/'];

// instance.interceptors.request.use(
//   (config) => {
//     const isNoAuthEndpoint = NO_AUTH_ENDPOINTS.some((endpoint) =>
//       config.url?.includes(endpoint),
//     );
//
//     if (!isNoAuthEndpoint) {
//       if (!config.headers?.['Authorization']) {
//         const accessToken = localStorage.getItem('accessToken');
//         if (accessToken) {
//           config.headers['Authorization'] = `Bearer ${accessToken}`;
//         } else {
//           window.location.href = '/';
//           console.error('Access token is missing. Redirecting to login...');
//         }
//       }
//     }
//
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   },
// );
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isNoAuthEndpoint = NO_AUTH_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (!isNoAuthEndpoint) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.error('Access token is missing');
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// instance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest:
//       | (InternalAxiosRequestConfig & { _retry?: boolean })
//       | undefined = error.config;
//
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes('/token/refresh/')
//     ) {
//       if (isRefreshing) {
//         return new Promise<string>((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token: string) => {
//             originalRequest.headers['Authorization'] = `Bearer ${token}`;
//             return instance(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }
//
//       originalRequest._retry = true;
//       isRefreshing = true;
//
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         clearAuthTokensAndRedirect();
//         return Promise.reject(new Error('Refresh token is missing'));
//       }
//
//       return new Promise((resolve, reject) => {
//         instance
//           .post('/token/refresh/', { refresh: refreshToken })
//           .then(
//             ({
//               data,
//             }: AxiosResponse<{
//               access: string;
//               refresh: string;
//             }>) => {
//               localStorage.setItem('accessToken', data.access);
//               localStorage.setItem('refreshToken', data.refresh);
//
//               instance.defaults.headers.common['Authorization'] =
//                 `Bearer ${data.access}`;
//               originalRequest.headers['Authorization'] =
//                 `Bearer ${data.access}`;
//
//               processQueue(null, data.access);
//               resolve(instance(originalRequest));
//             },
//           )
//           .catch((err: AxiosError) => {
//             processQueue(err, null);
//             clearAuthTokensAndRedirect();
//             reject(err);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       });
//     }
//
//     if (
//       error.response?.status === 401 &&
//       originalRequest?.url?.includes('/token/refresh/')
//     ) {
//       clearAuthTokensAndRedirect();
//       return Promise.reject(new Error('Session expired. Please login again.'));
//     }
//
//     return Promise.reject(error);
//   },
// );
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      originalRequest?.url?.includes('/token/') &&
      error.response?.status === 401
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      NO_RETRY_ENDPOINTS.some((endpoint) =>
        originalRequest.url?.includes(endpoint),
      )
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearAuthTokensAndRedirect();
      return Promise.reject(new Error('Refresh token is missing'));
    }

    try {
      const { data } = await instance.post<{ access: string; refresh: string }>(
        '/token/refresh/',
        { refresh: refreshToken },
      );

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      instance.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      originalRequest.headers.Authorization = `Bearer ${data.access}`;

      processQueue(null, data.access);
      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      clearAuthTokensAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default instance;
