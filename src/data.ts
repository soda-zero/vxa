export const data: Post[] = [
  {
    id: "3184757133198294001",
    shortcode: "Cwyh700LPvy",
    dimensions: { height: 1080, width: 1080 },
    display_url:
      "https://instagram.fros8-1.fna.fbcdn.net/v/t51.2885-15/374203076_284458817667132_7590749906608603855_n.heic?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fros8-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=RDVk9OaH6VwAX_zdjVO&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfCO7w2YUc06O2imKexIgULD-YhGxDk3Q2uXTzaDBNWUyA&oe=652CDABA&_nc_sid=2999b8",
    is_video: false,
    captions: [
      "Cacao en polvo marca Arcoa.\n" +
        "\n" +
        "#Veganoarg #vegana #veganismo #elfuturoesvegano #amigosnocomida #bevegan #govegan #veganoporaccidentearg #argentinavegana #vegano #vegan #veganismo #thefutureisvegan #friendnotfood #sevegano #aptovegan #vamosveganos #veggie #aptovegano #arcor #cacaovegano #cacao #arcoa",
    ],
  },
  {
    id: "3184757133198294002",
    shortcode: "Cwyh700LPvy",
    dimensions: { height: 1080, width: 1080 },
    display_url:
      "https://instagram.fros8-1.fna.fbcdn.net/v/t51.2885-15/374203076_284458817667132_7590749906608603855_n.heic?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fros8-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=RDVk9OaH6VwAX_zdjVO&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfCO7w2YUc06O2imKexIgULD-YhGxDk3Q2uXTzaDBNWUyA&oe=652CDABA&_nc_sid=2999b8",
    is_video: false,
    captions: [
      "Coca un polvo marca Arcoa.\n" +
        "\n" +
        "#Veganoarg #vegana #veganismo #elfuturoesvegano #amigosnocomida #bevegan #govegan #veganoporaccidentearg #argentinavegana #vegano #vegan #veganismo #thefutureisvegan #friendnotfood #sevegano #aptovegan #vamosveganos #veggie #aptovegano #arcor #cacaovegano #cacao #arcoa",
    ],
  },
];

export type Posts = Post[];

export interface Post {
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  display_url: string;
  is_video: boolean;
  captions: string[];
}

export interface Dimensions {
  height: number;
  width: number;
}
