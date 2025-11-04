
// AppAsset
import AppAsset from "@/core/AppAsset";

const imgs = [
  AppAsset.randomImage1,
  AppAsset.randomImage2,
  AppAsset.randomImage3,
  AppAsset.randomImage4,
  AppAsset.randomImage5,
  AppAsset.randomImage6,
];

export function getRandomNumber16(): any {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  return imgs[randomIndex];
}