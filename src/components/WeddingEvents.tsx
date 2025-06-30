import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Shirt,
  PartyPopper,
  Gem,
} from "lucide-react";
import { AddToCalendar } from "./AddToCalendar";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  locationUrl: string;
  description: string;
  dressCode?: string;
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
        <div className="space-y-4">
          <EventCard
            title="Welcome Party"
            date="October 25, 2025"
            time="8:00 PM"
            location="The Oyster House"
            address="35 S Market St, Charleston, SC 29401"
            locationUrl="https://theporchonmarket.com/#about"
            description="Join us for a relaxed evening to kick off our wedding weekend."
            dressCode="Cocktail Attire"
          />
        </div>
      )}

      <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-8 font-display text-sage-800 text-center">
          Wedding Day
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 border-b border-sage-200 pb-8">
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
                  Legare Waring House
                </a>
                <p className="text-sm text-gray-600">
                  1500 Old Towne Rd, Charleston, SC 29407
                </p>
              </>
            }
          />
          <InfoItem
            icon={<Shirt className="w-6 h-6 text-sage-600" />}
            title="Dress Code"
            content="Black Tie Optional"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <Gem className="w-6 h-6 mr-3 text-sage-600 flex-shrink-0" />
              <h4 className="text-2xl font-semibold text-sage-700">Ceremony</h4>
            </div>
            <div className="flex items-center justify-center md:justify-start pl-9">
              <Clock className="w-5 h-5 mr-2 text-sage-500 flex-shrink-0" />
              <p className="font-medium text-sage-600">5:00 PM</p>
            </div>
            <p className="text-sage-600 italic pl-9">
              Join us as we exchange vows and begin our journey together.
            </p>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <PartyPopper className="w-6 h-6 mr-3 text-sage-600 flex-shrink-0" />
              <h4 className="text-2xl font-semibold text-sage-700">
                Reception
              </h4>
            </div>
            <p className="text-sage-600 italic pl-9">
              Celebrate with us over dinner, drinks, and dancing immediately
              following the ceremony!
            </p>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-sage-200">
          <AddToCalendar
            event={{
              title: "Nobska & Henry's Wedding Ceremony & Reception",
              startDate: "2025-10-26T17:00:00",
              endDate: "2025-10-26T23:00:00",
              description:
                "Join us as we exchange vows and celebrate with dinner, drinks, and dancing! Black tie optional.",
              location:
                "Legare Waring House, 1500 Old Towne Rd, Charleston, SC 29407",
            }}
          />
        </div>
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
  dressCode,
}: EventCardProps) {
  const gridColsClass = dressCode
    ? "md:grid-cols-2 lg:grid-cols-4"
    : "md:grid-cols-3";

  return (
    <div className="bg-ivory-100 p-8 rounded-lg shadow-md">
      <h3 className="text-3xl font-semibold mb-6 font-display text-sage-800 text-center">
        {title}
      </h3>
      <div className={`grid gap-6 ${gridColsClass} mb-6`}>
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
              <p className="text-sm text-gray-600">{address}</p>
            </>
          }
        />
        {dressCode && (
          <InfoItem
            icon={<Shirt className="w-6 h-6 text-sage-600" />}
            title="Dress Code"
            content={dressCode}
          />
        )}
      </div>
      <p className="text-sage-600 italic text-center">{description}</p>
      <div className="text-center mt-6 pt-4 border-t border-sage-200">
        <AddToCalendar
          event={{
            title: "Nobska & Henry's Welcome Party",
            startDate: "2025-10-25T20:00:00",
            endDate: "2025-10-25T23:00:00",
            description:
              "Join us for a relaxed evening to kick off our wedding weekend. Cocktail attire.",
            location: "The Oyster House, 35 S Market St, Charleston, SC 29401",
          }}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon, title, content }: InfoItemProps) {
  return (
    <div className="flex items-start justify-center text-center md:justify-start md:text-left">
      <div className="mr-3 mt-1 flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <p className="font-semibold text-sage-700">{title}</p>
        {typeof content === "string" ? (
          <p className="text-gray-700">{content}</p>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
