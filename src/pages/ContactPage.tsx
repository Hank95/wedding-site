import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto pt-24">
        <Link
          to="/"
          className="inline-flex items-center text-sage-600 hover:text-sage-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-sage-800 mb-8 font-display text-center">
          Contact Us
        </h1>
        <p className="text-lg text-sage-700 mb-8 text-center">
          Have questions about our wedding? We're here to help! Fill out the
          form below or email us directly.
        </p>
        <div className="bg-white shadow-md rounded-lg p-8">
          <ContactForm />
        </div>
        <p className="mt-8 text-center text-sage-600">
          You can also email us directly at:{" "}
          <a
            href="mailto:nobskaandhenry2025@gmail.com"
            className="underline hover:text-sage-800 transition duration-300"
          >
            nobskaandhenry2025@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
