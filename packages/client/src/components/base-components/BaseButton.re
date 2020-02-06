type color =
  | Blue
  | Pink;

type variant =
  | Primary
  | Secondary
  | Tertiary;

module Styles = {
  let button = (variant, color) =>
    switch (variant, color) {
    | (Primary, Blue) => "btn btn-primary-blue"
    | (Primary, Pink) => "btn btn-primary-pink"
    | (Secondary, Blue) => "btn btn-secondary-blue"
    | (Secondary, Pink) => "btn btn-secondary-pink"
    | (Tertiary, Blue) => "btn btn-tertiary-blue"
    | (Tertiary, Pink) => "btn btn-tertiary-pink"
    };
};

[@react.component]
let make =
    (
      ~className="",
      ~color=Blue,
      ~disabled=false,
      ~children,
      ~onClick,
      ~variant=Primary,
    ) =>
  <button
    className={Css.merge([Styles.button(variant, color), className])}
    disabled
    onClick>
    children
  </button>;
