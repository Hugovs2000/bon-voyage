export const filterConfig = (d: Date | null): boolean => {
  const day = d || new Date();
  const today = new Date(new Date().setDate(new Date().getDate() - 1));
  return day > today;
};
