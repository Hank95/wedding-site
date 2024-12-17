import { useState, useEffect } from "react";
import { addGuestbookEntry, fetchGuestbookEntries } from "../api/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { GuestBookEntry } from "@/lib/types";

export function GuestBook() {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [name, setName] = useState("");
  const [entry, setEntry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const fetchedEntries = await fetchGuestbookEntries();
      setEntries(fetchedEntries);
    } catch {
      setError("Failed to load guestbook entries. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && entry) {
      setIsSubmitting(true);
      setError(null);
      try {
        await addGuestbookEntry({ name, entry });
        await loadEntries();
        setName("");
        setEntry("");
      } catch {
        setError("Failed to submit your entry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-sage-700 mb-1"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="entry"
                className="block text-sm font-medium text-sage-700 mb-1"
              >
                Entry
              </label>
              <Textarea
                id="entry"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                rows={4}
                className="w-full"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Sign Guestbook
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-sage-600">Loading guestbook entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-sage-600">
            No entries yet. Be the first to sign our guestbook!
          </p>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sage-800 mb-2">
                  {entry.name}
                </h3>
                <p className="text-sage-700 mb-2">{entry.entry}</p>
                <p className="text-xs text-sage-500">
                  {entry.created_at &&
                    new Date(entry.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
