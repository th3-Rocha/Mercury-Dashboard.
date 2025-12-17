# Token Expiry Monitoring Guide

## Overview

This guide explains how to use the token expiry monitoring features in the Mercury Dashboard. These utilities help detect when a JWT token is about to expire and automatically redirect users to the login page.

## Features

### 1. `isTokenExpiringSoon()` - Utility Function

Checks if a JWT token will expire within a specified time threshold (default: 30 seconds).

**Location:** `lib/utils.ts`

**Function Signature:**
```typescript
export function isTokenExpiringSoon(
  token: string | undefined,
  secondsThreshold: number = 30,
): boolean
```

**Parameters:**
- `token` - The JWT token to check (usually from cookies)
- `secondsThreshold` - Number of seconds before expiration to consider the token "expiring soon" (default: 30)

**Returns:**
- `true` if token will expire within the threshold or is already expired
- `false` if token is valid and has more time left
- `true` if token is undefined or invalid

**Example Usage:**
```typescript
import { isTokenExpiringSoon } from "@/lib/utils";
import Cookies from "js-cookie";

const token = Cookies.get("access_token");
if (isTokenExpiringSoon(token, 30)) {
  console.log("Token is expiring soon!");
  // Handle expiration...
}
```

### 2. `useTokenExpirySoon()` - Custom React Hook

A ready-to-use React hook that automatically monitors token expiration and redirects to login when the token is expiring soon.

**Location:** `hooks/useTokenExpirySoon.ts`

**Hook Signature:**
```typescript
export function useTokenExpirySoon(options: UseTokenExpirySoonOptions = {}): void
```

**Options:**
```typescript
interface UseTokenExpirySoonOptions {
  secondsThreshold?: number;      // Default: 30 seconds
  checkInterval?: number;          // Default: 5000ms (5 seconds)
  onTokenExpiringSoon?: () => void; // Optional callback
}
```

**How It Works:**
1. Checks the token expiration status at a regular interval
2. If token will expire within the threshold, it:
   - Removes the token from cookies
   - Clears authentication state
   - Redirects user to `/login`
   - Calls the optional `onTokenExpiringSoon` callback

## Implementation Examples

### Basic Usage in a Protected Component

```typescript
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";

export default function DashboardPage() {
  // Monitor token and auto-redirect if expiring soon
  useTokenExpirySoon();

  return (
    <div>
      {/* Your dashboard content */}
    </div>
  );
}
```

### With Custom Threshold

```typescript
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";

export default function SensitiveDataPage() {
  // Redirect if token expires in 60 seconds (more strict)
  useTokenExpirySoon({
    secondsThreshold: 60,
  });

  return (
    <div>
      {/* Your sensitive data */}
    </div>
  );
}
```

### With Custom Callback

```typescript
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";
import { useToast } from "@/components/ui/use-toast";

export default function ImportantPage() {
  const { toast } = useToast();

  useTokenExpirySoon({
    secondsThreshold: 30,
    onTokenExpiringSoon: () => {
      toast({
        title: "Session Expiring",
        description: "Your session is about to expire. You will be redirected to login.",
        variant: "warning",
      });
    },
  });

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

### With All Options

```typescript
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";

export default function FullyConfiguredPage() {
  useTokenExpirySoon({
    secondsThreshold: 45,        // Check if expiring in 45 seconds
    checkInterval: 10000,         // Check every 10 seconds
    onTokenExpiringSoon: () => {
      console.log("Token is expiring soon!");
      // Perform cleanup or show warning
    },
  });

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

### Using the Utility Function Directly

For more control, use the `isTokenExpiringSoon()` utility function:

```typescript
"use client";

import { useState, useEffect } from "react";
import { isTokenExpiringSoon } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CustomTokenCheck() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("access_token");
      
      if (isTokenExpiringSoon(token, 30)) {
        // Token is expiring soon
        router.push("/login");
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div>
      {timeRemaining !== null && (
        <p>Time remaining: {timeRemaining} seconds</p>
      )}
    </div>
  );
}
```

## Integration Points

### 1. Dashboard Layout

Add the hook to your main dashboard layout to protect all child pages:

```typescript
// app/dashboard/layout.tsx
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";
import { useAuthContext } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useAuthContext();

  useTokenExpirySoon({
    secondsThreshold: 30,
    checkInterval: 5000,
  });

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Your layout */}
      {children}
    </div>
  );
}
```

### 2. Specific Protected Pages

Add the hook to pages that handle sensitive operations:

```typescript
// app/dashboard/settings/page.tsx
"use client";

import { useTokenExpirySoon } from "@/hooks/useTokenExpirySoon";

export default function SettingsPage() {
  useTokenExpirySoon({
    secondsThreshold: 60, // More strict timeout
    onTokenExpiringSoon: () => {
      // Save any pending form data before redirect
    },
  });

  return (
    <div>
      {/* Settings content */}
    </div>
  );
}
```

## Best Practices

1. **Use the hook in protected components:** Add `useTokenExpirySoon()` to your dashboard layout or protected pages to ensure users are redirected before their token expires.

2. **Adjust threshold based on sensitivity:** Use a longer threshold (60+ seconds) for pages with sensitive operations to give users more warning.

3. **Provide user feedback:** Use the `onTokenExpiringSoon` callback to show a toast or notification warning users about the expiration.

4. **Don't add to every component:** Only add the hook to layout files or top-level protected components. Adding it to multiple nested components is redundant.

5. **Handle the redirect gracefully:** The hook automatically clears authentication state and removes the token cookie, so no additional cleanup is needed.

6. **Test with short tokens:** For testing, you can use tokens with short expiration times to verify the behavior without waiting for real token expiration.

## Existing Utility Functions

The following utility functions were already available in `lib/utils.ts`:

### `getTimeToGoLogin(token)`
Returns the expiration time of the token in milliseconds (epoch time).

### `isTokenExpired(token)`
Returns `true` if the token has already expired, `false` otherwise.

These work alongside the new `isTokenExpiringSoon()` function for comprehensive token management.

## Security Considerations

- The token is stored in HTTP-only cookies when possible (handled by the backend)
- The hook automatically clears the token from storage when expiration is detected
- The authentication context is cleared to ensure no stale user data remains
- All redirects go to the login page where users must re-authenticate

## Troubleshooting

### Token redirects happen too frequently
- Increase the `checkInterval` value (default is 5000ms)
- Reduce the `secondsThreshold` value

### Hook not triggering
- Ensure the component is wrapped in `AuthProvider`
- Check that the token is stored in cookies with the correct name `access_token`
- Verify the token has a valid `exp` claim

### User sees blank page before redirect
- Add a loading state or spinner while the hook performs its checks
- Consider showing a warning toast before redirecting

## Common Patterns

### Pattern 1: Warning Before Redirect
```typescript
const [showWarning, setShowWarning] = useState(false);

useTokenExpirySoon({
  secondsThreshold: 30,
  onTokenExpiringSoon: () => {
    setShowWarning(true);
    // User sees warning, automatic redirect after token expires
  },
});
```

### Pattern 2: Manual Token Refresh
If your backend supports token refresh:
```typescript
useTokenExpirySoon({
  secondsThreshold: 60,
  onTokenExpiringSoon: async () => {
    try {
      const newToken = await refreshToken();
      Cookies.set("access_token", newToken);
    } catch {
      // Refresh failed, let redirect happen
    }
  },
});
```

## API Reference

### `isTokenExpiringSoon(token, secondsThreshold)`

**Parameters:**
- `token: string | undefined` - JWT token to check
- `secondsThreshold: number = 30` - Seconds before expiration threshold

**Returns:** `boolean` - true if token is expiring soon or invalid

**Throws:** Never throws, returns true on error

---

**Last Updated:** 2024
**Version:** 1.0.0