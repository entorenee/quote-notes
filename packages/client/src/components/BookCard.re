open ReactUtils;
open Css;

type image = {
  alt: string,
  src: string,
};

type props = {
  authors: list(string),
  className: option(string),
  entryCount: int,
  image: option(image),
  synopsis: string,
  title: string,
};

module Styles = {
  open Theme;

  let wrapper = style([display(flexBox), flexDirection(column)]);

  let image = style([alignSelf(flexStart)]);

  let entries =
    style([
      textAlign(`right),
      fontWeight(bold),
      marginBottom(Spacer.sp03),
    ]);

  let entryButton = style([alignSelf(center)]);
};

[@react.component]
let make = (~authors, ~className=?, ~entryCount, ~image, ~synopsis=?, ~title) => {
  let authorLabel =
    switch (List.length(authors)) {
    | 0 => None
    | 1 => Some("Author: ")
    | _ => Some("Authors: ")
    };
  <div
    className={merge([
      Styles.wrapper,
      Belt.Option.getWithDefault(className, ""),
    ])}>
    {switch (image) {
     | None => React.null
     | Some({alt, src}) => <img className=Styles.image alt src />
     }}
    <BaseHeadline is=BaseHeadline.H3 variant=BaseHeadline.H4>
      {str(title)}
    </BaseHeadline>
    {switch (authorLabel) {
     | None => React.null
     | Some(label) =>
       <span> {str(label ++ stringConcat(", ", authors))} </span>
     }}
    {switch (synopsis) {
     | None => React.null
     | Some(text) => <p> {str(text)} </p>
     }}
    <div className=Styles.entries>
      {str("Total entries: " ++ string_of_int(entryCount))}
    </div>
    <BaseButton className=Styles.entryButton onClick={_e => ()}>
      {str("Add new entry")}
    </BaseButton>
  </div>;
};