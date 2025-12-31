const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

type ApiResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function fetchClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  if (!BACKEND_URL) {
    console.error("BACKEND_URL is not defined");
    return { success: false, message: "Server configuration error" };
  }

  const url = `${BACKEND_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If JSON parse fails, maybe it's empty body or text
      data = null;
    }

    if (!response.ok) {
        return {
            success: false,
            message: data?.message || response.statusText || "Request failed",
            data,
        }
    }

    return { success: true, data: data?.data || data }; // consistently unwrap 'data' if present, or return whole obj
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

export const api = {
  get: <T = any>(endpoint: string, headers?: any) =>
    fetchClient<T>(endpoint, { method: "GET", headers }),
  post: <T = any>(endpoint: string, body: any, headers?: any) =>
    fetchClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    }),
  put: <T = any>(endpoint: string, body: any, headers?: any) =>
    fetchClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    }),
  delete: <T = any>(endpoint: string, headers?: any) =>
    fetchClient<T>(endpoint, { method: "DELETE", headers }),
};
