open Css;
open Belt;

type level =
  | H1
  | H2
  | H3
  | H4;

module Styles = {
  let h1 = "text-blue-500 text-4xl sm:text-6xl";
  let h2 = "text-blue-500 text-3xl sm:text-5xl";
  let h3 = "text-blue-500 text-2xl sm:text-4xl";
  let h4 = "text-blue-500 text-xl sm:text-3xl";

  let headline = variant =>
    switch (variant) {
    | H1 => h1
    | H2 => h2
    | H3 => h3
    | H4 => h4
    };
};

[@react.component]
let make = (~children, ~className="", ~is, ~variant=?) =>
  switch (is) {
  | H1 =>
    <h1
      className={
        merge([
          Option.getWithDefault(variant, H1)->Styles.headline,
          className,
        ])
      }>
      children
    </h1>
  | H2 =>
    <h2
      className={
        merge([
          Styles.h2,
          Option.getWithDefault(variant, H2)->Styles.headline,
          className,
        ])
      }>
      children
    </h2>
  | H3 =>
    <h3
      className={
        merge([
          Option.getWithDefault(variant, H3)->Styles.headline,
          className,
        ])
      }>
      children
    </h3>
  | H4 =>
    <h4
      className={
        merge([
          Option.getWithDefault(variant, H4)->Styles.headline,
          className,
        ])
      }>
      children
    </h4>
  };