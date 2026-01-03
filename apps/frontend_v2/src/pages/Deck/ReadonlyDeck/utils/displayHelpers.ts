import type { UserInfo } from '../types';

/**
 * Gets the display name for the deck author
 * @param userInfo - Optional array containing user information
 * @returns The user's display name or "Anonymous" if not available
 */
export function getAuthorDisplayName(userInfo?: UserInfo[]): string {
  const [user] = userInfo || [];
  return user ? user.displayName : 'Anonymous';
}

/**
 * Formats the deck creation/update date for display
 * @param updatedUTC - UTC timestamp of last update
 * @param created - Original creation date
 * @returns Formatted date string or empty string if no date available
 */
export function getFormattedDate(updatedUTC?: number, created?: string): string {
  if (updatedUTC) {
    return new Date(updatedUTC).toLocaleDateString();
  }

  if (created) {
    return new Date(created).toLocaleDateString();
  }

  return '';
}
