/**
 * Date and time utility functions
 */

/**
 * Returns a string representing how long ago the date was
 * e.g. "2 hours ago", "3 days ago", "just now"
 * 
 * @param date The date to format
 * @returns A human-readable string representing time elapsed
 */
export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000; // seconds in a year
  
  if (interval > 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " year ago" : " years ago");
  }
  
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " month ago" : " months ago");
  }
  
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
  }
  
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
  }
  
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
  }
  
  if (seconds < 10) {
    return "just now";
  }
  
  return Math.floor(seconds) + (Math.floor(seconds) === 1 ? " second ago" : " seconds ago");
}

/**
 * Formats a date into a readable string
 * e.g. "April 12, 2025"
 * 
 * @param date The date to format
 * @returns A human-readable date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a date into a readable time string
 * e.g. "2:30 PM"
 * 
 * @param date The date to format
 * @returns A human-readable time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

/**
 * Formats a date into a readable date and time string
 * e.g. "April 12, 2025 at 2:30 PM"
 * 
 * @param date The date to format
 * @returns A human-readable date and time string
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}
