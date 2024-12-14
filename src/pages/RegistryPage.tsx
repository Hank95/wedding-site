import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const registries = [
  {
    name: "Amazon",
    url: "https://www.amazon.com/wedding/registry",
    logo: "/placeholder.svg?height=100&width=200&text=Amazon+Logo",
  },
  {
    name: "Crate & Barrel",
    url: "https://www.crateandbarrel.com/gift-registry/",
    logo: "/placeholder.svg?height=100&width=200&text=Crate+%26+Barrel+Logo",
  },
  {
    name: "Bed Bath & Beyond",
    url: "https://www.bedbathandbeyond.com/store/registry/",
    logo: "/placeholder.svg?height=100&width=200&text=Bed+Bath+%26+Beyond+Logo",
  },
];

export default function RegistryPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-3xl mx-auto mt-6">
        <Link
          to="/"
          className="inline-flex items-center text-sage-600 hover:text-sage-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-sage-800 mb-8 font-display text-center">
          Our Registry
        </h1>
        <p className="text-lg text-sage-700 mb-8 text-center">
          Thank you for thinking of us! We've registered at the following
          stores:
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registries.map((registry) => (
            <a
              key={registry.name}
              href={registry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105"
            >
              <img
                src={registry.logo}
                alt={`${registry.name} Logo`}
                className="mb-4"
              />
              <span className="text-sage-600 font-semibold">
                {registry.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
