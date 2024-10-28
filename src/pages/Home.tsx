import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function WeddingPage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const heroRef = useRef(null);

  useEffect(() => {
    const weddingDate = new Date("2024-06-15T16:00:00"); // Set your wedding date here

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
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Wedding Background"
          className="opacity-50"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="Wedding Logo"
              width={200}
              height={200}
              className="mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Jane & John
            </h1>
            <p className="text-xl text-gray-600">Are getting married!</p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Countdown to Our Big Day</h2>
          <div className="flex justify-center space-x-8">
            <div>
              <span className="text-4xl font-bold">{countdown.days}</span>
              <p>Days</p>
            </div>
            <div>
              <span className="text-4xl font-bold">{countdown.hours}</span>
              <p>Hours</p>
            </div>
            <div>
              <span className="text-4xl font-bold">{countdown.minutes}</span>
              <p>Minutes</p>
            </div>
            <div>
              <span className="text-4xl font-bold">{countdown.seconds}</span>
              <p>Seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding & Reception Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Wedding & Reception
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Ceremony</h3>
              <p>Join us as we exchange vows and begin our journey together.</p>
              <p className="mt-2">
                <strong>Date:</strong> June 15, 2024
                <br />
                <strong>Time:</strong> 4:00 PM
                <br />
                <strong>Location:</strong> Beautiful Garden Venue, 123 Flower
                St, Anytown, USA
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Reception</h3>
              <p>Celebrate with us over dinner, drinks, and dancing!</p>
              <p className="mt-2">
                <strong>Time:</strong> 6:00 PM - 11:00 PM
                <br />
                <strong>Location:</strong> Elegant Ballroom, 456 Party Ave,
                Anytown, USA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Itinerary */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Weekend Itinerary
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Friday, June 14</h3>
              <p>7:00 PM - Welcome Dinner at Local Restaurant</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Saturday, June 15</h3>
              <p>
                4:00 PM - Wedding Ceremony
                <br />
                6:00 PM - Reception
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Sunday, June 16</h3>
              <p>11:00 AM - Farewell Brunch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Travel Information
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Flights</h3>
              <p>The nearest airport is Anytown International Airport (XYZ).</p>
              <Link to="#" className="text-blue-600 hover:underline">
                Find Flights
              </Link>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Accommodations</h3>
              <p>We've arranged special rates at the following hotels:</p>
              <ul className="list-disc list-inside mt-2">
                <li>
                  Luxury Hotel -{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Book Now
                  </Link>
                </li>
                <li>
                  Cozy Inn -{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Book Now
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Call-to-Action */}
      <section id="rsvp" className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Celebrate With Us?
          </h2>
          <p className="mb-8">We can't wait to see you on our special day!</p>
          <Link
            to="/rsvp"
            className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300"
          >
            RSVP Now
          </Link>
        </div>
      </section>
    </>
  );
}
