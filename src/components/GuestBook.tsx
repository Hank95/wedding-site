"use client";

import { useState, useEffect } from "react";
import { addGuestbookEntry, fetchGuestbookEntries } from "../api/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import { GuestBookEntry } from "@/lib/types";

function GhostEntry() {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
      </CardContent>
    </Card>
  );
}

export function GuestBook() {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [name, setName] = useState("");
  const [entry, setEntry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 5; // Number of entries per page

  useEffect(() => {
    loadEntries();
  }, [currentPage]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const from = (currentPage - 1) * entriesPerPage;
      const to = from + entriesPerPage - 1;

      const fetchedEntries = await fetchGuestbookEntries(from, to);
      setEntries(fetchedEntries.entries);
      setTotalPages(
        Math.ceil((fetchedEntries.totalCount ?? 0) / entriesPerPage)
      );
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
        setCurrentPage(1);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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

      <div aria-live="polite">
        {isLoading ? (
          Array(entriesPerPage)
            .fill(0)
            .map((_, index) => <GhostEntry key={index} />)
        ) : entries.length === 0 ? (
          <p className="text-center text-sage-600">
            No entries yet. Be the first to sign our guestbook!
          </p>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="mb-4">
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sage-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
