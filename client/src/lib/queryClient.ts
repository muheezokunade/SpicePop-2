import { QueryClient, QueryFunction } from "@tanstack/react-query";

const AUTH_STORAGE_KEY = 'spicepop_admin_auth';

// Helper function to get stored auth credentials
function getAuthCredentials(): string | null {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return null;
  }
}

// Helper function to store auth credentials
export function setAuthCredentials(username: string, password: string): void {
  try {
    const credentials = `Basic ${btoa(`${username}:${password}`)}`;
    localStorage.setItem(AUTH_STORAGE_KEY, credentials);
  } catch (e) {
    console.error('Failed to store credentials:', e);
  }
}

// Helper function to clear auth credentials
export function clearAuthCredentials(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear credentials:', e);
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  
  if (data) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Add Authorization header for admin routes
  if (url.includes('/api/') && (
      url.includes('/categories') || 
      url.includes('/products') || 
      url.includes('/orders') || 
      url.includes('/blog') || 
      url.includes('/settings') ||
      url.includes('/auth/check')
    )) {
    const authHeader = getAuthCredentials();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const headers: Record<string, string> = {};
    
    // Add Authorization header for admin routes
    if (url.includes('/api/') && (
        url.includes('/categories') || 
        url.includes('/products') || 
        url.includes('/orders') || 
        url.includes('/blog') || 
        url.includes('/settings') ||
        url.includes('/auth/check')
      )) {
      const authHeader = getAuthCredentials();
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
