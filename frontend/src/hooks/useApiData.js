import { useEffect, useState } from "react";
import api from "../services/api.js";

/**
 * Fetches data from the given API endpoint. If the request fails
 * (e.g. backend not deployed yet, or MongoDB not yet connected in
 * Phase 3), falls back to the provided local data so the site
 * still renders real, correct content instead of breaking.
 */
export default function useApiData(endpoint, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api
      .get(endpoint)
      .then((res) => {
        if (!isMounted) return;
        const payload = res.data?.data;
        // Only replace fallback if the API actually returned something
        if (payload && (!Array.isArray(payload) || payload.length > 0)) {
          setData(payload);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (isMounted) setUsingFallback(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, usingFallback };
}
