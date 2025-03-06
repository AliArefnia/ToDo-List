export default function ValidateEmptyAndLong(input) {
  const inputLength = input.trim().length;
  console.log(inputLength);
  if (inputLength === 0 || inputLength > 200) {
    return false;
  }
  return true;
}
