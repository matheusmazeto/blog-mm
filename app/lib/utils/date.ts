export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    dateStyle: 'long',
  })
}
