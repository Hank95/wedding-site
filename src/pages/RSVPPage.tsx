// src/components/RSVPForm.tsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "true", // Stored as string, converted to boolean on submission
    plusOneName: "",
    dietaryRestrictions: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert attending value to boolean
    const attendingBool = formData.attending === "true";

    try {
      const { error } = await supabase.from("rsvps").insert([
        {
          name: formData.name,
          email: formData.email,
          attending: attendingBool,
          plus_one_name: formData.plusOneName,
          dietary_restrictions: formData.dietaryRestrictions,
          message: formData.message,
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="p-4">
      {submitted ? (
        <div className="text-center text-green-600 font-semibold">
          Thank you for your RSVP!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="attending"
              className="block text-sm font-medium text-gray-700"
            >
              Will you be attending?
            </label>
            <select
              id="attending"
              name="attending"
              value={formData.attending}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="plusOneName"
              className="block text-sm font-medium text-gray-700"
            >
              Plus One Name (if applicable):
            </label>
            <input
              type="text"
              id="plusOneName"
              name="plusOneName"
              value={formData.plusOneName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="dietaryRestrictions"
              className="block text-sm font-medium text-gray-700"
            >
              Dietary Restrictions:
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message (Optional):
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit RSVP
          </button>
        </form>
      )}
    </div>
  );
};

export default RSVPForm;
