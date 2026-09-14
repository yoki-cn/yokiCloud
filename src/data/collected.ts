export type CollectedLine = {
  id: string;
  title: string;
  text: string;
  meta: string;
};

export type CollectedImage = {
  id: string;
  title: string;
  src: string;
  alt: string;
  meta: string;
};

// Collected boards (replace with your own)
export const COLLECTED_LINES: CollectedLine[] = [
  {
    id: "q-01",
    title: "CAPTURED LINE",
    text: "博士，时间在我前进时仍旧在流淌，我还不知道结局会是什么样，但我相信有你在，我们一定能达成最完满的那一个。",
    meta: "LOG / QUOTE BUFFER",
  },
];

export const COLLECTED_IMAGES: CollectedImage[] = [
  {
    id: "img-01",
    title: "CAPTURED IMAGE",
    src: "collected/img-01.avif",
    alt: "Collected image 01",
    meta: "DEPOT / IMAGE BUFFER",
  },
];
