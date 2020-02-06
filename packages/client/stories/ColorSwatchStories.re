open BsStorybook.Story;

let _module = [%bs.raw "module"];

let swatchGroups: list(ColorSwatch.swatchGroup) = [
  {
    title: "Blue Swatches",
    swatches: [
      {className: "bg-blue-100", label: "Blue 100"},
      {className: "bg-blue-200", label: "Blue 200"},
      {className: "bg-blue-300", label: "Blue 300"},
      {className: "bg-blue-400", label: "Blue 400"},
      {className: "bg-blue-500", label: "Blue 500"},
      {className: "bg-blue-600", label: "Blue 600"},
      {className: "bg-blue-700", label: "Blue 700"},
      {className: "bg-blue-800", label: "Blue 800"},
      {className: "bg-blue-900", label: "Blue 900"},
    ],
  },
  {
    title: "Pink Swatches",
    swatches: [
      {className: "bg-pink-100", label: "Pink 100"},
      {className: "bg-pink-200", label: "Pink 200"},
      {className: "bg-pink-300", label: "Pink 300"},
      {className: "bg-pink-400", label: "Pink 400"},
      {className: "bg-pink-500", label: "Pink 500"},
      {className: "bg-pink-600", label: "Pink 600"},
      {className: "bg-pink-700", label: "Pink 700"},
      {className: "bg-pink-800", label: "Pink 800"},
      {className: "bg-pink-900", label: "Pink 900"},
    ],
  },
  {
    title: "Neutral Swatches",
    swatches: [
      {className: "bg-white", label: "White"},
      {className: "bg-neutral-100", label: "Neutral 100"},
      {className: "bg-neutral-200", label: "Neutral 200"},
      {className: "bg-neutral-300", label: "Neutral 300"},
      {className: "bg-neutral-400", label: "Neutral 400"},
      {className: "bg-neutral-500", label: "Neutral 500"},
      {className: "bg-neutral-600", label: "Neutral 600"},
      {className: "bg-neutral-700", label: "Neutral 700"},
      {className: "bg-neutral-800", label: "Neutral 800"},
      {className: "bg-neutral-900", label: "Neutral 900"},
      {className: "bg-black", label: "Black"},
    ],
  },
];

storiesOf("Color Swatches", _module)
->add("default", () => <ColorSwatch swatchGroups />);
