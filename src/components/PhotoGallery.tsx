import { useState } from "react";
import { X } from "lucide-react";

const photos = [
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300",
];

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedPhoto}
              alt="Selected photo"
              className="max-w-full max-h-[90vh]"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
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
