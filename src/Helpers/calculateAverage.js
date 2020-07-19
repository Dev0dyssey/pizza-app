export const calculateAverage = (value) => {
  return isNaN(value)
    ? Math.round((value.reduce((a, b) => a + b, 0) / value.length) * 100) / 100
    : 0;
};
