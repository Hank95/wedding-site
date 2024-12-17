import { CalendarDays, MapPin, Clock } from "lucide-react";

export function WeddingEvents() {
  return (
    <div className="space-y-12">
      <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-6 font-display text-sage-800 text-center">
          Rehearsal Dinner & Welcome Party
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start justify-center">
            <CalendarDays className="w-6 h-6 mr-3 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Date</p>
              <p>October 25, 2025</p>
            </div>
          </div>
          <div className="flex items-start justify-center">
            <Clock className="w-6 h-6 mr-3 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Time</p>
              <p>7:00 PM</p>
            </div>
          </div>
          <div className="flex items-start justify-center">
            <MapPin className="w-6 h-6 mr-3 text-sage-600 mt-1" />
            <div>
              <p className="font-semibold text-sage-700">Location</p>
              <p>TBD</p>
            </div>
          </div>
        </div>
        <p className="text-sage-600 italic mt-6 text-center">
          Join us for a relaxed evening to kick off our wedding weekend. More
          details will be provided as we get closer to the date.
        </p>
      </div>

      <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-6 font-display text-sage-800 text-center">
          Wedding Day
        </h3>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <h4 className="text-2xl font-semibold text-sage-700 text-center">
              Ceremony
            </h4>
            <div className="flex items-start justify-center">
              <Clock className="w-6 h-6 mr-3 text-sage-600 mt-1" />
              <div>
                <p className="font-semibold text-sage-700">Time</p>
                <p>5:00 PM</p>
              </div>
            </div>
            <p className="text-sage-600 italic text-center">
              Join us as we exchange vows and begin our journey together.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-2xl font-semibold text-sage-700 text-center">
              Reception
            </h4>
            <div className="flex items-start justify-center">
              <Clock className="w-6 h-6 mr-3 text-sage-600 mt-1" />
              <div>
                <p className="font-semibold text-sage-700">Time</p>
                <p>6:30 PM - 11:30 PM</p>
              </div>
            </div>
            <p className="text-sage-600 italic text-center">
              Celebrate with us over dinner, drinks, and dancing!
            </p>
          </div>
        </div>
        <div className="border-t border-sage-200 pt-8">
          <h4 className="text-2xl font-semibold text-sage-700 text-center mb-6">
            Venue Information
          </h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start justify-center">
              <CalendarDays className="w-6 h-6 mr-3 text-sage-600 mt-1" />
              <div>
                <p className="font-semibold text-sage-700">Date</p>
                <p>October 26, 2025</p>
              </div>
            </div>
            <div className="flex items-start justify-center">
              <MapPin className="w-6 h-6 mr-3 text-sage-600 mt-1" />
              <div>
                <p className="font-semibold text-sage-700">Location</p>
                <p>Legare Waring House, Charleston, SC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
