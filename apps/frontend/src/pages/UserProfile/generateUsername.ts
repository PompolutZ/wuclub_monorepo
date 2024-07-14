const prefixes = ["Doom of", "Curse of", "Nemesis of", "Salvation of"];
const postfixes = [
  "Beastgrave",
  "Shadespire",
  "Kathophranes",
  "Direchasm",
  "Ghur",
];
const random = (max: number) => Math.floor(Math.random() * Math.floor(max));

export const generateUsername = () =>
  `${prefixes[random(prefixes.length - 1)]} ${postfixes[random(postfixes.length - 1)]}`;
