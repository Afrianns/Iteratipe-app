export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const convertDate = (date: Date | null) => {
  if (!date || isNaN(date.getTime())) return '';
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};