import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const storyEvents = [
  {
    date: "May 15, 2020",
    title: "First Meet",
    description: "We met at a local coffee shop...",
  },
  {
    date: "August 22, 2020",
    title: "First Date",
    description: "Our first official date was...",
  },
  {
    date: "February 14, 2022",
    title: "The Proposal",
    description: "Henry proposed on Valentine's Day...",
  },
  // Add more events as needed
];

export function OurStory() {
  const [currentEvent, setCurrentEvent] = useState(0);

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % storyEvents.length);
  };

  const prevEvent = () => {
    setCurrentEvent(
      (prev) => (prev - 1 + storyEvents.length) % storyEvents.length
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-ivory-100 p-8 rounded-lg shadow-md">
        <button
          onClick={prevEvent}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-sage-500 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2 font-display">
            {storyEvents[currentEvent].title}
          </h3>
          <p className="text-sage-600 mb-4">{storyEvents[currentEvent].date}</p>
          <p>{storyEvents[currentEvent].description}</p>
        </div>
        <button
          onClick={nextEvent}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-sage-500 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
