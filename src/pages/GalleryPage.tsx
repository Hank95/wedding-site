import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const engagementPhotos = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  url: `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/egagement/engagement_${i}.webp`,
  alt: `Engagement photo ${i + 1}`,
}));

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const openLightbox = (id: number) => setSelectedPhoto(id);
  const closeLightbox = () => setSelectedPhoto(null);

  return (
    <div className="bg-ivory-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {engagementPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`${index % 3 === 0 ? "row-span-2" : ""} ${
                index % 5 === 0 ? "col-span-2" : ""
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => openLightbox(photo.id)}
              />
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
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
