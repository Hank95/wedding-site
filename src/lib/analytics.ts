// Google Analytics 4 utility functions

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

// Track page views (handled automatically by GA4, but useful for manual tracking)
export const trackPageView = (page_title: string, page_location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-8Q24KWF7ZJ', {
      page_title,
      page_location,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Wedding-specific event tracking functions
export const analytics = {
  // RSVP Events
  rsvpStarted: () => {
    trackEvent('rsvp_started', 'engagement', 'rsvp_form');
  },
  
  rsvpSubmitted: (attending: boolean) => {
    trackEvent('rsvp_submitted', 'conversion', attending ? 'attending' : 'not_attending');
  },
  
  rsvpCompleted: (attending: boolean) => {
    trackEvent('rsvp_completed', 'conversion', attending ? 'attending' : 'not_attending', 1);
  },

  // Navigation Events
  pageVisited: (pageName: string) => {
    trackEvent('page_view', 'navigation', pageName);
  },

  // Gallery Events
  galleryImageViewed: (imageIndex: number) => {
    trackEvent('image_viewed', 'engagement', 'gallery', imageIndex);
  },

  galleryModalOpened: () => {
    trackEvent('modal_opened', 'engagement', 'photo_gallery');
  },

  // Contact Events
  contactFormStarted: () => {
    trackEvent('contact_started', 'engagement', 'contact_form');
  },

  contactFormSubmitted: () => {
    trackEvent('contact_submitted', 'conversion', 'contact_form');
  },

  // Registry Events
  registryLinkClicked: (registryName: string) => {
    trackEvent('registry_clicked', 'engagement', registryName);
  },

  // Calendar Events
  calendarDownloaded: (calendarType: string) => {
    trackEvent('calendar_downloaded', 'engagement', calendarType);
  },

  // Map Events
  mapInteraction: (action: string, location?: string) => {
    trackEvent(action, 'map_interaction', location);
  },

  // Guestbook Events
  guestbookEntrySubmitted: () => {
    trackEvent('guestbook_entry', 'engagement', 'guestbook');
  },

  // External Link Tracking
  externalLinkClicked: (url: string, linkText?: string) => {
    trackEvent('external_link_clicked', 'outbound', linkText || url);
  },

  // Social Sharing (if added)
  socialShare: (platform: string, content: string) => {
    trackEvent('social_share', 'engagement', `${platform}:${content}`, 1);
  },

  // Error Tracking
  errorOccurred: (errorType: string, errorMessage?: string) => {
    trackEvent('error', 'technical', errorMessage ? `${errorType}:${errorMessage}` : errorType);
  },
};


// Track user engagement time
export const trackEngagement = (engagementTime: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_time_msec: engagementTime,
    });
  }
};

// Track scroll depth
export const trackScrollDepth = (scrollPercent: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll', {
      percent_scrolled: scrollPercent,
    });
  }
};