export const evaluatePasswordStrength = (password) => {
  let strength = 0;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  const length = password.length;
  if (length > 7) {
    strength = {
      strength: 25,
      color: "red",
      text: "Weak",
    };
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      strength = {
        strength: 100,
        color: "green",
        text: "Excellent",
      };
    } else if (
      (hasUpperCase && hasLowerCase && hasNumbers) ||
      (hasUpperCase && hasLowerCase && hasSpecialChars) ||
      (hasLowerCase && hasNumbers && hasSpecialChars)
    ) {
      strength = {
        strength: 75,
        color: "dark-green",
        text: "Very good",
      };
    } else if (
      (hasUpperCase && hasLowerCase) ||
      (hasLowerCase && hasNumbers) ||
      (hasLowerCase && hasSpecialChars)
    ) {
      strength = {
        strength: 50,
        color: "orange",
        text: "Good",
      };
    }
  } else {
    strength = {
      strength: 10,
      color: "red",
      text: "Very weak",
    };
  }
  return strength;
};
