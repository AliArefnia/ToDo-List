export default function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const disposableDomains = ["mailinator.com", "tempmail.com"];
  const domain = email.split("@")[1];

  return (
    regex.test(email) &&
    !disposableDomains.includes(domain) &&
    email.length <= 254 &&
    email.trim().length !== 0
  );
}
