import { useEffect } from "react";

export function useMetadata({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    
    // Update description meta tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", description);
      document.head.appendChild(metaDescription);
    }
  }, [title, description]);
}
