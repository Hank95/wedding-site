import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    // For now, we'll just simulate a successful submission
    console.log("Form submitted:", { name, email, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-sage-100 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-sage-800">
          Thank You!
        </h3>
        <p className="text-sage-700">
          Your message has been sent. We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-sage-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-sage-300 shadow-xs focus:border-sage-500 focus:ring-3 focus:ring-sage-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-sage-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-sage-300 shadow-xs focus:border-sage-500 focus:ring-3 focus:ring-sage-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-sage-700"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-sage-300 shadow-xs focus:border-sage-500 focus:ring-3 focus:ring-sage-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-sage-600 text-white py-2 px-4 rounded-md hover:bg-sage-700 focus:outline-hidden focus:ring-2 focus:ring-sage-500 focus:ring-opacity-50 transition duration-300"
      >
        Send Message
      </button>
    </form>
  );
}
