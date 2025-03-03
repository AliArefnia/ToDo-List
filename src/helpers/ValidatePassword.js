export default function validatePassword(pass) {
  return pass.length <= 254 && pass.trim().length !== 0;
}
