export default function ValidateEmptyAndLong(input) {
  const inputLength = input.trim().length;
  if (inputLength === 0 || inputLength > 100) {
    return false;
  }
  return true;
}
