import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo-crop.svg";
import { Countdown } from "../components/Countdown";
import { Section } from "../components/Section";
import { OurStory } from "../components/OurStory";
import { PhotoGallery } from "../components/PhotoGallery";
import { GuestBook } from "../components/GuestBook";
import { WeddingParty } from "../components/WeddingParty";
import { InteractiveMap } from "../components/InteractiveMap";

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
    <div className="font-serif text-sage-900">
      {/* Hero Section */}
      <section className="relative h-screen">
        <img
          src="/public/wedding_oaks.webp"
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <img
              src={Logo}
              alt="Wedding Logo"
              width={200}
              height={200}
              className="mx-auto mb-8"
            />
            <h1 className="text-6xl font-bold text-sage-800 mb-4 font-display">
              Nobska and Henry
            </h1>
            <p className="text-2xl text-sage-600 font-light">
              Are getting married!
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <Section className="bg-ivory-100">
        <h2 className="text-4xl font-bold mb-8 font-display">
          Countdown to Our Big Day
        </h2>
        <Countdown countdown={countdown} />
      </Section>

      {/* Our Story Section */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Our Story
        </h2>
        <OurStory />
      </Section>

      {/* Photo Gallery */}
      <Section className="bg-sage-100">
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Our Journey in Pictures
        </h2>
        <PhotoGallery />
      </Section>

      {/* Wedding & Reception Info */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Wedding & Reception
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Ceremony
            </h3>
            <p>Join us as we exchange vows and begin our journey together.</p>
            <p className="mt-2">
              <strong>Date:</strong> October 26, 2025
              <br />
              <strong>Time:</strong> 5:00 PM
              <br />
              <strong>Location:</strong> Magnolia Plantation and Gardens,
              Charleston, SC
            </p>
          </div>
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Reception
            </h3>
            <p>Celebrate with us over dinner, drinks, and dancing!</p>
            <p className="mt-2">
              <strong>Time:</strong> 6:30 PM - 11:30 PM
              <br />
              <strong>Location:</strong> Magnolia Plantation and Gardens,
              Charleston, SC
            </p>
          </div>
        </div>
      </Section>

      {/* Wedding Party */}
      <Section className="bg-ivory-100">
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Meet the Wedding Party
        </h2>
        <WeddingParty />
      </Section>

      {/* Interactive Map */}
      <Section>
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Explore Charleston
        </h2>
        <InteractiveMap />
      </Section>

      {/* Charleston Information */}
      <Section className="bg-sage-100">
        <h2 className="text-4xl font-bold mb-8 text-center font-display">
          Discover Charleston
        </h2>
        <p className="text-center mb-8">
          Join us in the charming city of Charleston, South Carolina, known for
          its rich history, beautiful architecture, and Southern hospitality.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Historic Downtown
            </h3>
            <p>
              Explore the cobblestone streets, colorful row houses, and historic
              landmarks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Culinary Delights
            </h3>
            <p>
              Indulge in world-class cuisine and traditional Lowcountry dishes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Coastal Beauty
            </h3>
            <p>
              Enjoy pristine beaches, scenic waterfronts, and beautiful gardens.
            </p>
          </div>
        </div>
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
            <Link to="#" className="text-sage-600 hover:underline">
              Find Flights
            </Link>
          </div>
          <div className="bg-ivory-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 font-display">
              Accommodations
            </h3>
            <p>We've arranged special rates at the following hotels:</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Charleston Place -{" "}
                <Link to="#" className="text-sage-600 hover:underline">
                  Book Now
                </Link>
              </li>
              <li>
                The Vendue -{" "}
                <Link to="#" className="text-sage-600 hover:underline">
                  Book Now
                </Link>
              </li>
            </ul>
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

      {/* RSVP Call-to-Action */}
      <Section className="bg-sage-800 text-ivory-100">
        <h2 className="text-4xl font-bold mb-4 font-display">
          Ready to Celebrate With Us?
        </h2>
        <p className="mb-8">We can't wait to see you on our special day!</p>
        <Link
          to="/rsvp"
          className="bg-ivory-100 text-sage-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-ivory-200 transition duration-300"
        >
          RSVP Now
        </Link>
      </Section>
    </div>
  );
}
