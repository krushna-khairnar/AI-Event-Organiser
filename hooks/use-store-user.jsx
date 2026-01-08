import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function useStoreUser() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { user } = useUser();

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function createUser() {
      try {
        const id = await storeUser();
        if (!cancelled) {
          setUserId(id);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    createUser();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id, storeUser]);

  return {
    userId,
    isLoading: authLoading || isLoading,
  };
}
