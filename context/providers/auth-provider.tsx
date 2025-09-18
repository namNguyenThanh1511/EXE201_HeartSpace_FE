"use client";

import { LoginForm } from "@/components/login-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/zustand/auth-store";
import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { useAuth as useAuthHook } from "@/hooks/services/use-auth";
// Use the actual return type from the useAuth hook and extend it
type AuthContextType = ReturnType<typeof useAuthHook> & {
  showAuthDialog: (onAuthSuccess?: () => void) => void;
  AuthDialog: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { syncAuthState } = useAuthStore();
  const authHook = useAuthHook();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    syncAuthState();
  }, [syncAuthState]);

  useEffect(() => {
    if (authHook.isAuthenticated && showAuthDialog) {
      setShowAuthDialog(false);
      // Execute the callback if it exists
      if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
        setOnAuthSuccessCallback(null);
      }
    }
  }, [authHook.isAuthenticated, showAuthDialog, onAuthSuccessCallback]);

  // Listen for logout events to close auth dialog
  useEffect(() => {
    const handleLogout = () => {
      setShowAuthDialog(false);
      setOnAuthSuccessCallback(null);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  const showAuthDialogForFeature = (onAuthSuccess?: () => void) => {
    if (!authHook.isAuthenticated) {
      if (onAuthSuccess) {
        setOnAuthSuccessCallback(() => onAuthSuccess);
      }
      setShowAuthDialog(true);
    }
  };

  const AuthDialog = (
    <Dialog
      open={showAuthDialog}
      onOpenChange={(open) => {
        setShowAuthDialog(open);
        if (!open) {
          // Clear callback if dialog is closed without authentication
          setOnAuthSuccessCallback(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md max-w-lg p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );

  const contextValue: AuthContextType = {
    ...authHook,
    showAuthDialog: showAuthDialogForFeature,
    AuthDialog,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {AuthDialog}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook that requires authentication
export function useRequireAuth() {
  const { isAuthenticated, loading, showAuthDialog } = useAuth();

  const requireAuth = (onAuthSuccess?: () => void) => {
    if (!loading && !isAuthenticated) {
      showAuthDialog(onAuthSuccess);
      return false;
    }
    return isAuthenticated;
  };

  return {
    isAuthenticated,
    loading,
    requireAuth,
  };
}

// Export the auth hook directly for backward compatibility
export { useAuth as useAuthHook } from "@/hooks/services/use-auth";
