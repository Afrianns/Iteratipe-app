export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const convertDate = (date: Date | null) => {
  if (!date || isNaN(date.getTime())) return '';
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};


export const convertDateToISOString = (dateStr: string | null): string | null => {
  if (!dateStr) return null;

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  // Extract the raw calendar numbers directly from the local object
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  // Manually construct the clean string instead of using .toISOString()
  return `${year}-${month}-${day}`; 
};