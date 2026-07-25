import { useEffect } from "react";

/**
 * Sets the document title and meta description for the current page.
 * Replaces react-helmet-async, which does not yet officially support
 * React 19's peer dependency range.
 */
export default function useDocumentHead({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
