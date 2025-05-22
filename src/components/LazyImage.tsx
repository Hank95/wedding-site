import { useState, useEffect } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: "lazy" | "eager";
}

export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=",
  loading = "lazy"
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef || loading === "eager") {
      if (loading === "eager") {
        setImageSrc(src);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, src, loading]);

  // Load the actual image when in view
  useEffect(() => {
    if (!isInView && loading === "lazy") return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [isInView, src, loading]);

  // Check if className already contains opacity class
  const hasOpacity = className.includes('opacity-');
  
  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={hasOpacity 
        ? `transition-opacity duration-300 ${className}` 
        : `transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-70"
          } ${className}`
      }
      loading={loading}
    />
  );
}