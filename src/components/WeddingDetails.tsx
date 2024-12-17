import { CalendarDays, MapPin, Clock } from "lucide-react";

export function WeddingDetails() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 font-display text-sage-800">
          Ceremony
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <CalendarDays className="w-5 h-5 mr-2 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Date</p>
              <p>October 26, 2025</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-2 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Time</p>
              <p>5:00 PM</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Location</p>
              <p>Legare Waring House, Charleston, SC</p>
            </div>
          </div>
          <p className="text-sage-600 italic">
            Join us as we exchange vows and begin our journey together.
          </p>
        </div>
      </div>
      <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 font-display text-sage-800">
          Reception
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-2 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Time</p>
              <p>6:30 PM - 11:30 PM</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Location</p>
              <p>Legare Waring House, Charleston, SC</p>
            </div>
          </div>
          <p className="text-sage-600 italic">
            Celebrate with us over dinner, drinks, and dancing!
          </p>
        </div>
      </div>
    </div>
  );
}
