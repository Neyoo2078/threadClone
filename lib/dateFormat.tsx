export function getTimeDifference(date: any) {
  const now: any = new Date();
  const diff = now - date;

  // Calculate the time difference in seconds
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return seconds + ' seconds ago';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes + ' minutes ago';
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours + ' hours ago';
  } else {
    // Get the month and day of the month
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return month + ' ' + day;
  }
}

// Usage
const inputDate = new Date('2023-10-25T12:00:00');
console.log(getTimeDifference(inputDate));
