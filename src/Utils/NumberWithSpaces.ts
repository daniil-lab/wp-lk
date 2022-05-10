const NumberWithSpaces = (value: number | string): string | number =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export default NumberWithSpaces;
