open Css;

[@react.component]
let make = (~className="", ~children) =>
  <div className={merge(["py-4 px-2", className])}> children </div>;
