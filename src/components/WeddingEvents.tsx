import React, { useState, useEffect } from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  locationUrl: string;
  description: string;
}

interface EventDetailsProps {
  title: string;
  time?: string;
  description: string;
}

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export function WeddingEvents() {
  const [isWeddingDay, setIsWeddingDay] = useState(false);

  useEffect(() => {
    const today = new Date();
    const weddingDate = new Date("2025-10-26");
    setIsWeddingDay(
      today.getDate() === weddingDate.getDate() &&
        today.getMonth() === weddingDate.getMonth() &&
        today.getFullYear() === weddingDate.getFullYear()
    );
  }, []);

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {!isWeddingDay && (
        <EventCard
          title="Welcome Party"
          date="October 25, 2025"
          time="8:00 PM"
          location="The Oyster House"
          address="66 State St, Charleston, SC 29401"
          locationUrl="https://theporchonmarket.com/#about"
          description="Join us for a relaxed evening to kick off our wedding weekend."
        />
      )}

      <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-6 font-display text-sage-800 text-center">
          Wedding Day
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <EventDetails
            title="Ceremony"
            time="5:00 PM"
            description="Join us as we exchange vows and begin our journey together."
          />
          <EventDetails
            title="Reception"
            description="Celebrate with us over dinner, drinks, and dancing immediately following the ceremony!"
          />
        </div>
        {!isWeddingDay && (
          <div className="border-t border-sage-200 pt-8 mt-8">
            <h4 className="text-2xl font-semibold text-sage-700 text-center mb-6">
              Venue Information
            </h4>
            <div className="grid md:grid-cols-2 gap-8">
              <InfoItem
                icon={<CalendarDays className="w-6 h-6 text-sage-600" />}
                title="Date"
                content="October 26, 2025"
              />
              <InfoItem
                icon={<MapPin className="w-6 h-6 text-sage-600" />}
                title="Location"
                content={
                  <>
                    <a
                      href="https://southcarolinaparks.com/legare-waring-house"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-600 hover:text-sage-800 underline"
                    >
                      Legare Waring House, Charleston, SC
                    </a>
                    <p>1500 Old Towne Rd, Charleston, SC 29407</p>
                  </>
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({
  title,
  date,
  time,
  location,
  address,
  locationUrl,
  description,
}: EventCardProps) {
  return (
    <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
      <h3 className="text-3xl font-semibold mb-6 font-display text-sage-800 text-center">
        {title}
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <InfoItem
          icon={<CalendarDays className="w-6 h-6 text-sage-600" />}
          title="Date"
          content={date}
        />
        <InfoItem
          icon={<Clock className="w-6 h-6 text-sage-600" />}
          title="Time"
          content={time}
        />
        <InfoItem
          icon={<MapPin className="w-6 h-6 text-sage-600" />}
          title="Location"
          content={
            <>
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 hover:text-sage-800 underline"
              >
                {location}
              </a>
              <p>{address}</p>
            </>
          }
        />
      </div>
      <p className="text-sage-600 italic mt-6 text-center">{description}</p>
    </div>
  );
}

function EventDetails({ title, time, description }: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-2xl font-semibold text-sage-700 text-center">
        {title}
      </h4>
      {time && (
        <div className="flex items-center justify-center">
          <Clock className="w-6 h-6 mr-3 text-sage-600" />
          <p className="font-semibold text-sage-700">{time}</p>
        </div>
      )}
      <p className="text-sage-600 italic text-center">{description}</p>
    </div>
  );
}

function InfoItem({ icon, title, content }: InfoItemProps) {
  return (
    <div className="flex items-start justify-center">
      <div className="mr-3 mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-sage-700">{title}</p>
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
    </div>
  );
}
