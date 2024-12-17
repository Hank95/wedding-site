import { CalendarDays, MapPin } from "lucide-react";

export function RehearsalAndWelcome() {
  return (
    <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 font-display text-sage-800">
        Rehearsal Dinner & Welcome Party
      </h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <CalendarDays className="w-5 h-5 mr-2 text-sage-600 mt-1" />
          <div>
            <p className="font-semibold text-sage-700">Date</p>
            <p>October 25, 2025</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-5 h-5 mr-2 text-sage-600 mt-1" />
          <div>
            <p className="font-semibold text-sage-700">Location</p>
            <p>TBD</p>
          </div>
        </div>
        <p className="text-sage-600 italic">
          Join us for a relaxed evening to kick off our wedding weekend. More
          details will be provided as we get closer to the date.
        </p>
      </div>
    </div>
  );
}
