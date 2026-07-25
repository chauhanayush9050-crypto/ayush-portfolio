import useApiData from "./useApiData.js";

/**
 * Fetches the public Profile/Settings document (personal info, social
 * links, images, portfolio/SEO settings). Deliberately has NO fallback
 * content — per requirement, nothing here is ever faked or placeholder.
 * If unreachable, `settings` is null and callers should render nothing
 * (or their existing static UI) for the affected fields.
 */
export default function useSiteSettings() {
  const { data, loading } = useApiData("/settings", null);
  return { settings: data, loading };
}
