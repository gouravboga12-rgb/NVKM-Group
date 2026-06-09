import { useEffect } from 'react';

export default function SEO({ title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl }) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update description meta tag
    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);
    }

    // Update keywords meta tag
    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', keywords);
    }

    // Helper to update OG tags
    const updateOGTag = (property, content) => {
      if (content === undefined || content === null) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', ogTitle || title);
    updateOGTag('og:description', ogDescription || description);
    if (ogImage) {
      // Resolve paths if relative
      const resolvedImage = ogImage.startsWith('http') 
        ? ogImage 
        : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      updateOGTag('og:image', resolvedImage);
    }
    updateOGTag('og:url', ogUrl || window.location.href);
    updateOGTag('og:type', 'website');

    // Helper to update Twitter tags
    const updateTwitterTag = (name, content) => {
      if (content === undefined || content === null) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', ogTitle || title);
    updateTwitterTag('twitter:description', ogDescription || description);
    if (ogImage) {
      const resolvedImage = ogImage.startsWith('http') 
        ? ogImage 
        : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      updateTwitterTag('twitter:image', resolvedImage);
    }

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl]);

  return null;
}
