export function getFormattedDate(updatedUTC?: number, created?: string): string {
  if (updatedUTC) {
    return new Date(updatedUTC).toLocaleDateString();
  }

  if (created) {
    return new Date(created).toLocaleDateString();
  }

  return '';
}
