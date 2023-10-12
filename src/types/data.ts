export type Posts = Post[];

export interface Post {
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  img_src: string;
  is_video: boolean;
  captions: string[];
}

export interface Dimensions {
  height: number;
  width: number;
}

export const posts: Post[] = [
  {
    id: "3184757133198294002",
    shortcode: "Cwyh700LPvy",
    dimensions: {
      height: 1080,
      width: 1080,
    },
    img_src: "../public/images/Cwyh700LPvy.jpg",
    is_video: false,
    captions: [
      "Cacao en polvo marca Arcoa.\n\n#Veganoarg #vegana #veganismo #elfuturoesvegano #amigosnocomida #bevegan #govegan #veganoporaccidentearg #argentinavegana #vegano #vegan #veganismo #thefutureisvegan #friendnotfood #sevegano #aptovegan #vamosveganos #veggie #aptovegano #arcor #cacaovegano #cacao #arcoa",
    ],
  },
  {
    id: "3184757133198294003",
    shortcode: "Cwyh700LPvy",
    dimensions: {
      height: 1080,
      width: 1080,
    },
    img_src: "../public/images/Cwyh700LPvy.jpg",
    is_video: false,
    captions: [
      "Cacao en polvo marca Arcoa.\n\n#Veganoarg #vegana #veganismo #elfuturoesvegano #amigosnocomida #bevegan #govegan #veganoporaccidentearg #argentinavegana #vegano #vegan #veganismo #thefutureisvegan #friendnotfood #sevegano #aptovegan #vamosveganos #veggie #aptovegano #arcor #cacaovegano #cacao #arcoa",
    ],
  },
];
