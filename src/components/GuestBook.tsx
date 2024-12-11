import { useState } from "react";

interface GuestBookEntry {
  name: string;
  message: string;
}

export function GuestBook() {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setEntries([...entries, { name, message }]);
      setName("");
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
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
            className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-sage-500 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
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
            rows={4}
            className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-sage-500 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="bg-ivory-100 p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-sage-800">{entry.name}</h3>
            <p className="text-sage-700">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
