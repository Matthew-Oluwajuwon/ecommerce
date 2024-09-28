"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = void 0;
// Function to generate a random password
const generateRandomPassword = (length = 12) => {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    // Ensure the password includes at least one of each character type
    const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;
    // Randomly select at least one character from each character type
    const passwordArray = [
        lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
        upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
        numberChars[Math.floor(Math.random() * numberChars.length)],
        specialChars[Math.floor(Math.random() * specialChars.length)],
    ];
    // Fill the rest of the password length with random characters from all character types
    for (let i = passwordArray.length; i < length; i++) {
        passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    // Shuffle the password array to prevent predictable patterns
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    return passwordArray.join('');
};
exports.generateRandomPassword = generateRandomPassword;
