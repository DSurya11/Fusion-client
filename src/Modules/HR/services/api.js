export const getAuthToken = () => localStorage.getItem("authToken");

export const authHeaders = (extraHeaders = {}) => {
  const token = getAuthToken();

  return {
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...extraHeaders,
  };
};

export const authorizedFetch = (url, options = {}) => {
  const headers = authHeaders(options.headers || {});
  return fetch(url, { ...options, headers });
};
