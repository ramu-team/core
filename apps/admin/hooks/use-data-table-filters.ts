import { useCallback, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useDataTableFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to get current search parameters as an object
  const getParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const [localParams, setLocalParams] = useState(getParams());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalParams(getParams());
  }, [searchParams, getParams]);

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }

      // Always reset to page 1 when changing filters, if pagination was implemented.
      // For now we just push the new search params.
      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  return {
    searchParams: localParams,
    setFilter,
    clearFilters,
  };
}
