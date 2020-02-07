open Css;

type shadow =
  | Small
  | Medium
  | Large
  | XL;

let shadowClass = shadowVariant =>
  switch (shadowVariant) {
  | Small => "shadow-sm"
  | Medium => "shadow-md"
  | Large => "shadow-lg"
  | XL => "shadow-xl"
  };

[@react.component]
let make = (~className="", ~children, ~shadowSize=Medium) =>
  <div
    className={
      merge(["rounded-lg py-4 px-6", shadowClass(shadowSize), className])
    }>
    children
  </div>;
