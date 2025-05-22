import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
}

interface AddToCalendarProps {
  event: CalendarEvent;
  className?: string;
}

export function AddToCalendar({ event, className = "" }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format dates for different calendar services
  const formatDateForGoogle = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateForOutlook = (date: string) => {
    return new Date(date).toISOString();
  };

  // Generate calendar URLs
  const generateGoogleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDateForGoogle(event.startDate)}/${formatDateForGoogle(event.endDate)}`,
      details: event.description || '',
      location: event.location || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateOutlookUrl = () => {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: formatDateForOutlook(event.startDate),
      enddt: formatDateForOutlook(event.endDate),
      body: event.description || '',
      location: event.location || '',
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  const generateICSFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Site//Calendar//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForGoogle(event.startDate)}`,
      `DTEND:${formatDateForGoogle(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || ''}`,
      `UID:${Date.now()}@wedding-site.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calendarOptions = [
    {
      name: 'Google Calendar',
      action: () => window.open(generateGoogleCalendarUrl(), '_blank'),
    },
    {
      name: 'Outlook',
      action: () => window.open(generateOutlookUrl(), '_blank'),
    },
    {
      name: 'Apple Calendar',
      action: generateICSFile,
    },
    {
      name: 'Other (ICS file)',
      action: generateICSFile,
    },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-sage-700 hover:bg-sage-800 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Add ${event.title} to calendar`}
      >
        <Calendar className="h-4 w-4" />
        Add to Calendar
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-sage-200 z-20"
            role="menu"
            aria-orientation="vertical"
          >
            {calendarOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-sm text-sage-700 hover:bg-sage-50 hover:text-sage-900 focus:bg-sage-50 focus:text-sage-900 focus:outline-none transition-colors first:rounded-t-md last:rounded-b-md"
                role="menuitem"
              >
                {option.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}