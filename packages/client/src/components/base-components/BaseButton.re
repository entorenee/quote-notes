type variant =
  | Primary
  | Secondary;

module Styles = {
  open Css;

  let baseButtonStyles = "py-3 px-4 text-light text-xl";

  let primary = merge([baseButtonStyles, "bg-primary"]);

  let secondary = merge([baseButtonStyles, "bg-accent-dark"]);

  let button = variant =>
    switch (variant) {
    | Primary => primary
    | Secondary => secondary
    };
};

[@react.component]
let make =
    (~className="", ~disabled=false, ~children, ~onClick, ~variant=Primary) =>
  <button
    className={Css.merge([Styles.button(variant), className])}
    disabled
    onClick>
    children
  </button>;
