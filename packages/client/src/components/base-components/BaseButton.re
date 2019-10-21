module Styles = {
  open Css;

  let button = style([padding2(~v=rem(0.5), ~h=rem(2.0))]);
};

[@react.component]
let make = (~className="", ~disabled=false, ~children, ~onClick) =>
  <button className={Css.merge([Styles.button, className])} disabled onClick>
    children
  </button>;