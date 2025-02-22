import { useState, useEffect } from "react";
import { Countdown } from "../components/Countdown";
import { Section } from "../components/Section";
// import { OurStory } from "../components/OurStory";
import { PhotoGallery } from "../components/PhotoGallery";
import { GuestBook } from "../components/GuestBook";
// import { WeddingParty } from "../components/WeddingParty";
import { InteractiveMap } from "../components/InteractiveMap";
import { ContactForm } from "../components/ContactForm";
import { WeddingEvents } from "../components/WeddingEvents";

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
        <img
          src="/legare_green.webp"
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center background-sage-900 bg-opacity-70">
          <div className="text-center z-10">
            {/* <img
              src="/NH-Logo.webp"
              alt="Wedding Logo"
              width={200}
              height={200}
              className="mx-auto mb-8"
            /> */}
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
        <img
          src="/NH-Logo.webp"
          alt="Wedding Logo"
          width={200}
          height={200}
          className="mx-auto m-8"
        />
      </Section>

      {/* Our Story Section */}
      {/* <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Our Story
        </h2>
        <OurStory />
      </Section> */}

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

      {/* Travel Information */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Travel Information
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Flights
            </h3>
            <p>
              The nearest airport is Charleston International Airport (CHS).
            </p>
            <a
              href="https://www.iflychs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 hover:underline"
            >
              Find Flights
            </a>
          </div>
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Ground Transportation
            </h3>
            <p className="mb-4">
              Rental cars are available at the airport through several
              companies:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>
                <a
                  href="https://www.hertz.com/rentacar/reservation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Hertz
                </a>
              </li>
              <li>
                <a
                  href="https://www.enterprise.com/en/home.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Enterprise
                </a>
              </li>
              <li>
                <a
                  href="https://www.avis.com/en/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Avis
                </a>
              </li>
            </ul>
            <p>
              Uber and Lyft are readily available throughout Charleston and
              provide reliable transportation to and from the airport, as well
              as around the city.
            </p>
          </div>
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Accommodations
            </h3>
            <p>
              We've arranged special rates at the following hotels in downtown
              Charleston:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                The Hilton Charleston -{" "}
                <a
                  href="https://www.hilton.com/en/hotels/chshhhf-hilton-charleston-historic-district/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Book Now
                </a>
              </li>
              <li>
                Marriott Charleston -{" "}
                <a
                  href="https://www.marriott.com/en-us/hotels/chsmc-charleston-marriott/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Book Now
                </a>
              </li>
              <li>
                Moxy Charleston Downtown -{" "}
                <a
                  href="https://www.marriott.com/en-us/hotels/chsmx-moxy-charleston-downtown/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline"
                >
                  Book Now
                </a>
              </li>
            </ul>
            <p className="mt-4">
              For those looking for house rentals, StayDuvet offers a variety of
              options. Wedding guests can get a 5% discount using the promo code
              "JCROOMBLOCKS".
            </p>
            <a
              href="https://www.stayduvet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 hover:underline"
            >
              Check StayDuvet Rentals
            </a>
            <p className="mt-4 text-sm text-sage-700">
              Please mention the "Goodhue/Pendleton Wedding" when booking to
              receive our special group rate.
            </p>
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
