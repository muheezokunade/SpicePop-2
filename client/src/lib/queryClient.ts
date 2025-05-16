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

// Helper function to add delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  retries = 3
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
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    // Handle rate limiting specifically
    if (res.status === 429 && retries > 0) {
      // Get retry-after header or use exponential backoff
      const retryAfter = res.headers.get('retry-after');
      const delayTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, 4 - retries) * 1000;
      
      console.log(`Rate limited. Retrying after ${delayTime}ms. Attempts left: ${retries-1}`);
      await delay(delayTime);
      return apiRequest(method, url, data, retries - 1);
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Retry on network errors with backoff
    if (error instanceof TypeError && retries > 0) {
      const delayTime = Math.pow(2, 4 - retries) * 1000;
      console.log(`Network error. Retrying after ${delayTime}ms. Attempts left: ${retries-1}`);
      await delay(delayTime);
      return apiRequest(method, url, data, retries - 1);
    }
    throw error;
  }
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
    
    let retries = 3;
    
    while (retries >= 0) {
      try {
        const res = await fetch(url, {
          credentials: "include",
          headers
        });
        
        if (unauthorizedBehavior === "returnNull" && res.status === 401) {
          return null;
        }
        
        // Handle rate limiting specifically
        if (res.status === 429 && retries > 0) {
          const retryAfter = res.headers.get('retry-after');
          const delayTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, 4 - retries) * 1000;
          
          console.log(`Rate limited. Retrying query after ${delayTime}ms. Attempts left: ${retries-1}`);
          await delay(delayTime);
          retries--;
          continue;
        }
        
        await throwIfResNotOk(res);
        return await res.json();
      } catch (error) {
        // Retry on network errors with backoff
        if (error instanceof TypeError && retries > 0) {
          const delayTime = Math.pow(2, 4 - retries) * 1000;
          console.log(`Network error in query. Retrying after ${delayTime}ms. Attempts left: ${retries-1}`);
          await delay(delayTime);
          retries--;
          continue;
        }
        throw error;
      }
    }
    
    throw new Error("Maximum retries exceeded");
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 3, // Enable react-query's built-in retry mechanism as well
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max of 30 seconds
    },
    mutations: {
      retry: 2, // Also add retries for mutations
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});
