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
      { length: 3 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/adventure/adventure_${
          i + 1
        }.webp`
    ),
    description:
      "Wherever we are, we’ll find an adventure. We’ve spent the past 8 years of our relationship hiking, sailing, skiing, biking, traveling, and road-tripping all over the U.S. We skied and reached the summit of many Adirondack 46ers in New York throughout college. After graduation, we drove out to Colorado and camped along I-70 until we reached Bryce Canyon National Park, where we confidently meandered the desert backcountry. We’ve sailed, hiked, and committed every inch of the Eagles Mere, PA trails and lake to memory (Henry’s known EM by heart since 1995). Name any ski area in Vermont or Maine and we’ll have a good story about each (Henry quickly loved Cannon, Nobska’s home mountain in New Hampshire). In the Great Smoky Mountains, we were awed by a herd of wild boar stampeding through the hills around us as we trekked. The deep blue waters of Narragansett Bay know us well and our annual SLU ski trip has taken us to Utah and Washington chasing waist-deep powder. Henry runs marathons. Nobska does yoga. We love nature and we like to believe She loves us back.",
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
    description: `To our understanding, when you love midsize coastal towns with colonial architecture, cobblestones, and rich history you end up in one of three places: Newport, Rhode Island (check); Annapolis, Maryland (we’re curious!); or Charleston, South Carolina. In 2022 we took a chance on a place we’d visited only once together five years prior by packing up a Uhaul and heading South. The splendor of soft Spanish moss juxtaposed with spiky palmetto trees draws you in immediately. Steeples punctuate the skyline, their bells echoing over marshlands that shimmer like liquid gold at sunset. The air carries aromas of salt and jasmine. People are friendly and the colors vibrant. We spend our days enjoying the pristine dunes of Sullivan’s Island, sampling the world-renowned restaurant scene, and basking in the Lowcountry sunshine. By some stroke of luck, we made friends here that we feel blessed to now call family, in the remarkable way one can only hope for when moving far away. Charleston feels like a living, breathing poem and therefore the perfect backdrop to formally commit a life of love and adventure together in marriage.\r\n 

We hope you grow to appreciate Charleston as much as we do! If you’re curious to feel the culture or want to learn more about the history before arriving, our favorite reads are: anything by Pat Conroy, “The Demon of Unrest” by Erik Larson (Henry), and Josephine Pinckney’s “Three O’Clock Dinner” (Nobska).`,
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
      "We met in London during study abroad in August of 2016. Both of us knew of the other at St. Lawrence (shoutout to the Best Man, Michael Weaver) but we hadn’t met in-person. On the first night of our program, in the North London suburb of Muswell Hill, we started talking, played some Snooker and the rest was history. Our first solo date was two nights later at the Maid of Muswell pub. We spent the evening sharing our mutual loves for sailing, skiing, and the great outdoors over Gin & Tonic’s. During the semester that followed we explored the city, Western England, Ireland, and the South of France while studying British history, politics, and theater; reconvening (almost) nightly at the Maid for games of Gin Rummy. It rained a lot. We fell in love. It was a magical time. 8 years later Muswell (“Muzzy”) the Labrador Retriever watched her parents get engaged on her favorite beach. It was raining. (See engagement gallery for photos.)",
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
      "Post-graduation Henry decided to live on a boat in Rhode Island and embrace the Pendleton family’s New England roots. Luckily, Massachusetts native Nobska was just an hour north in Boston for graduate school. When winter rolled around and temperatures dropped Henry packed himself up and moved to Newport, where Nobska joined him on weekends and in the summer to teach junior sailing programs. Visiting Cape Cod Henry was able to see the famous Nobska Lighthouse and have a pint in Woods Hole at the Captain Kidd, where James Goodhue first saw Cynthia (née Anderson) laughing on a barstool in the 80’s. We have many fond memories of speeding through the waves of Narragansett Bay, weighing anchor for weekends on Block Island, and bantering (sometimes not so calmly) about which of us is the better skipper. ",
  },
  {
    name: "St. Lawrence University",
    images: Array.from(
      { length: 3 },
      (_, i) =>
        `https://tikctxevleeookrwogmj.supabase.co/storage/v1/object/public/images/slu/slu_${
          i + 1
        }.webp`
    ),
    description:
      "When 3 out of your 4 parents call St. Lawrence their alma mater, some say it’s meant to be. Yet SLU spoke for itself: campus boasted an outdoorsy culture with gloating promises of skiing every weekend in Lake Placid, trumpeted an excellent liberal arts education paired with a close-knit community feel, and proclaimed we’d find ourselves forever changed after a four-year tenure. That was spot-on. We spent our time in upstate New York exploring the Adirondacks and building relationships with lifelong friends (there was thankfully a little studying, too). An old legend says 30% of students meet their future spouse at St. Lawrence. In our experience, the percentage is much higher. Here we go, Saints! A special thank you to James Goodhue ‘82, Newton “Tripp” Pendleton ‘86, and Katrine Pendleton ‘88.",
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
        lightboxRef.current &&
        !lightboxRef.current.contains(event.target as Node)
      ) {
        closeImage();
      } else if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !selectedImage
      ) {
        closeLocation();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeLocation, closeImage, selectedImage]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => openLocation(location)}
            className="bg-sage-200 hover:bg-sage-300 text-sage-800 font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {location.name}
          </button>
        ))}
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-40"
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
