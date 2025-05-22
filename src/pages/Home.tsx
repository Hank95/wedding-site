import { useState, useEffect } from "react";
import { Countdown } from "../components/Countdown";
import { Section } from "../components/Section";
import { PhotoGallery } from "../components/PhotoGallery";
import { GuestBook } from "../components/GuestBook";
import { InteractiveMap } from "../components/InteractiveMap";
import { ContactForm } from "../components/ContactForm";
import { WeddingEvents } from "../components/WeddingEvents";
import { LazyImage } from "../components/LazyImage";
import { Plane, Car, Hotel, ExternalLink } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button"; // Import Button component if available

export default function WeddingPage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2025-10-26T17:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-formal text-sage-900">
      {/* Hero Section */}
      <section className="relative h-screen">
        <LazyImage
          src="/legare_green.webp"
          alt="Beautiful wedding venue with oak trees"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 flex items-center justify-center background-sage-900 bg-opacity-70">
          <div className="text-center z-10">
            <h1 className="text-6xl font-bold text-sage-900 mb-4 font-script">
              Nobska and Henry
            </h1>
            <p className="text-3xl text-sage-900 font-light">
              are getting married!
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <Section className="bg-ivory-100">
        <h2 className="text-4xl font-bold mb-8 font-display text-center">
          Countdown to Our Big Day
        </h2>
        <Countdown countdown={countdown} />
        <LazyImage
          src="/NH-Logo.webp"
          alt="Nobska and Henry Wedding Logo"
          className="w-[200px] h-[200px] object-contain mx-auto m-8"
        />
      </Section>

      {/* Photo Gallery */}
      <Section className="bg-sage-100">
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Our Journey in Pictures
        </h2>
        <p className="text-center mb-8 text-lg text-sage-700">
          Click on a location to see photos from our time there
        </p>
        <PhotoGallery />
      </Section>

      {/* Wedding Events */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Wedding Events
        </h2>
        <WeddingEvents />
      </Section>

      {/* Interactive Map */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Explore Charleston
        </h2>
        <InteractiveMap />
      </Section>

      {/* Travel Information - Redesigned */}
      <Section className="bg-sage-50">
        <h2 className="text-4xl font-bold mb-12 text-center font-display">
          Travel & Accommodations
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flights Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <Plane className="w-8 h-8 mr-3 text-sage-700" />
              <h3 className="text-2xl font-semibold font-display text-sage-800">
                Flights
              </h3>
            </div>
            <p className="text-sage-700 mb-4 flex-grow">
              The nearest airport is Charleston International Airport (CHS).
              Easy access from many major cities.
            </p>
            <Button asChild variant="outline" className="mt-auto">
              <a
                href="https://www.iflychs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Visit CHS Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>

          {/* Ground Transportation Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <Car className="w-8 h-8 mr-3 text-sage-700" />
              <h3 className="text-2xl font-semibold font-display text-sage-800">
                Getting Around
              </h3>
            </div>
            <div className="text-sage-700 mb-4 flex-grow">
              <p className="mb-3">
                Rental cars are available at CHS. Consider booking in advance.
              </p>
              <p className="font-medium mb-1">Rental Agencies:</p>
              <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                <li>Hertz</li>
                <li>Enterprise</li>
                <li>Avis</li>
              </ul>
              <p>
                Uber and Lyft are readily available for convenient city travel
                and airport transfers.
              </p>
            </div>
          </div>

          {/* Accommodations Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <Hotel className="w-8 h-8 mr-3 text-sage-700" />
              <h3 className="text-2xl font-semibold font-display text-sage-800">
                Accommodations
              </h3>
            </div>
            <div className="text-sage-700 mb-4 flex-grow">
              <p className="mb-3">
                We've arranged special rates at these downtown hotels. Mention
                the "Goodhue/Pendleton Wedding".
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  {
                    name: "The Hilton Charleston",
                    url: "https://www.hilton.com/en/hotels/chsdwgi-hilton-garden-inn-charleston-waterfront-downtown/",
                  },
                  {
                    name: "Marriott Charleston",
                    url: "https://www.marriott.com/en-us/hotels/chsmc-charleston-marriott/overview/",
                  },
                  {
                    name: "Moxy Charleston Downtown",
                    url: "https://www.marriott.com/en-us/hotels/chsox-moxy-charleston-downtown/overview/",
                  },
                ].map((hotel) => (
                  <li key={hotel.name}>
                    <Button
                      asChild
                      variant="link"
                      className="p-0 h-auto font-normal text-sage-700"
                    >
                      <a
                        href={hotel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        {hotel.name}
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="mb-2">
                For house rentals, check StayDuvet. Use code{" "}
                <strong className="font-semibold">JCROOMBLOCKS</strong> for a 5%
                discount.
              </p>
              <Button
                asChild
                variant="link"
                className="p-0 h-auto font-normal text-sage-700"
              >
                <a
                  href="https://www.stayduvet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Visit StayDuvet
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Guest Book */}
      <Section className="bg-ivory-100">
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Guest Book
        </h2>
        <GuestBook />
      </Section>

      {/* Contact Us */}
      <Section className="bg-sage-800 text-ivory-100">
        <h2 className="text-4xl font-bold mb-4 font-display text-center">
          Contact Us
        </h2>
        <p className="mb-8 text-center">
          Have questions? Reach out to us! We're here to help.
        </p>
        <div className="max-w-md mx-auto">
          <ContactForm />
        </div>
        <p className="mt-8 text-center text-sm">
          You can also email us directly at:{" "}
          <a
            href="mailto:nobskaandhenry2025@gmail.com"
            className="underline hover:text-sage-300 transition duration-300"
          >
            nobskaandhenry2025@gmail.com
          </a>
        </p>
      </Section>
    </div>
  );
}
