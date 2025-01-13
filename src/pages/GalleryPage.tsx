import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const engagementPhotos = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  url: `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/egagement/engagement_${i}.webp`,
  alt: `Engagement photo ${i + 1}`,
}));

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const openLightbox = (id: number) => setSelectedPhoto(id);
  const closeLightbox = () => setSelectedPhoto(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-ivory-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sage-600 hover:text-sage-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-sage-800 mb-8 font-display text-center">
          Our Engagement Gallery
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {engagementPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out ${
                index % 5 === 0 ? "col-span-2 row-span-2" : ""
              } ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => openLightbox(photo.id)}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full">
            <img
              src={engagementPhotos[selectedPhoto].url}
              alt={engagementPhotos[selectedPhoto].alt}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-sage-500 p-2 rounded-full hover:bg-sage-600 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
