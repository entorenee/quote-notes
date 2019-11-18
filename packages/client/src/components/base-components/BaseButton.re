type variant =
  | Primary
  | Secondary;

module Styles = {
  open Css;
  open Theme;

  let baseButtonStyles =
    style([
      padding2(~v=Spacer.sp01, ~h=Spacer.sp04),
      color(Colors.light),
      fontSize(FontSize.xl),
    ]);

  let primary =
    merge([baseButtonStyles, style([backgroundColor(Colors.primary)])]);
  let secondary =
    merge([baseButtonStyles, style([backgroundColor(Colors.accentDark)])]);

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