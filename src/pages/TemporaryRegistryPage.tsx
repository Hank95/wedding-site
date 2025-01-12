import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TemporaryRegistryPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-3xl mx-auto mt-6">
        <Link
          to="/"
          className="inline-flex items-center text-sage-600 hover:text-sage-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-sage-800 mb-8 font-display text-center">
          Wedding Registry Coming Soon
        </h1>
        <p className="text-lg text-sage-700 mb-8 text-center">
          Thank you for your patience! Our wedding registry will be available
          shortly.
        </p>
      </div>
    </div>
  );
}
