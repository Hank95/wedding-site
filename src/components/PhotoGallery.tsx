import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface Location {
  name: string;
  images: string[];
  description: string;
}

const locations: Location[] = [
  {
    name: "Adventure",
    images: Array.from(
      { length: 5 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/adventure/adventure_${
          i + 1
        }.webp`
    ),
    description:
      "Our love for adventure has taken us to breathtaking landscapes and thrilling experiences. Each photo captures a moment of excitement and the joy of exploring the world together.",
  },
  {
    name: "Charleston",
    images: Array.from(
      { length: 3 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/chs/chs_${
          i + 1
        }.webp`
    ),
    description:
      "Charleston holds a special place in our hearts. Its charming streets, historic architecture, and Southern hospitality have been the backdrop for many of our cherished memories.",
  },
  {
    name: "London",
    images: Array.from(
      { length: 3 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/london/london_${
          i + 1
        }.webp`
    ),
    description:
      "We met in London on study abroad in August 2016. Both of us knew of each other at St. Lawrence (shoutout to the Best Man, Michael Weaver) but we hadn’t met in person. On the first night in the North London suburb of Muswell Hill we started talking, played some Snooker and the rest was history. Our first solo date two nights later at the Maid of Muswell pub we spent the evening sharing our loves for sailing, skiing, and the great outdoors over gin & tonic’s. During the semester that followed we explored the city, Western England, Ireland, and the South of France while studying British history, politics, and theater; reconvening (almost) nightly at the Maid in Muswell Hill for a game of Gin Rummy. It rained a lot. We fell in love. It was a magical time. 8 years later Muswell (“Muzzy”) the Labrador Retriever watched her parents get engaged on her favorite beach. It was raining.",
  },
  {
    name: "Newport",
    images: Array.from(
      { length: 3 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/newport/newport_${
          i + 1
        }.webp`
    ),
    description:
      "Newport's coastal beauty and Gilded Age charm provided a perfect setting for romance. We enjoyed leisurely walks along the Cliff Walk and picturesque sunsets by the harbor.",
  },
  {
    name: "St. Lawrence University",
    images: Array.from(
      { length: 4 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/slu/slu_${
          i + 1
        }.webp`
    ),
    description:
      "St. Lawrence University is where our story began. These images capture the beautiful campus where we met, studied, and fell in love, surrounded by the warmth of the SLU community.",
  },
];

function LazyImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleImageLoad();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (imgRef.current) {
            imgRef.current.src = src;
          }
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "100px" }
    );

    const currentImgRef = imgRef.current;

    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    if (imgRef.current) {
      setIsPortrait(imgRef.current.naturalHeight > imgRef.current.naturalWidth);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative ${isPortrait ? "h-64 md:h-80" : "h-48"}`}>
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${isPortrait ? "object-top" : "object-center"}`}
        onLoad={handleImageLoad}
        onClick={onClick}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-sage-200 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

export function PhotoGallery() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const openLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const closeLocation = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeLocation();
      }
      if (
        lightboxRef.current &&
        !lightboxRef.current.contains(event.target as Node)
      ) {
        closeImage();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeLocation, closeImage]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => openLocation(location)}
            className="bg-sage-100 hover:bg-sage-200 text-sage-800 font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {location.name}
          </button>
        ))}
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-sage-800">
                {selectedLocation.name}
              </h3>
              <button
                onClick={closeLocation}
                className="text-sage-600 hover:text-sage-800"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sage-700 mb-6">{selectedLocation.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedLocation.images.map((image, index) => (
                <LazyImage
                  key={index}
                  src={image}
                  alt={`${selectedLocation.name} ${index + 1}`}
                  onClick={() => openImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={lightboxRef} className="relative max-w-full max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Selected photo"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 text-white bg-sage-500 p-2 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
