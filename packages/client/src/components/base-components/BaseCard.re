open Css;

[@react.component]
let make = (~className="", ~children) =>
  <div className={merge(["rounded-lg shadow-md py-4 px-6", className])}>
    children
  </div>;
