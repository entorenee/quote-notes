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

[@react.component]
let make = (~authors, ~className=?, ~entryCount, ~image, ~synopsis=?, ~title) => {
  let authorLabel =
    switch (List.length(authors)) {
    | 0 => None
    | 1 => Some("Author: ")
    | _ => Some("Authors: ")
    };
  <div
    className={
      merge(["flex flex-col", Belt.Option.getWithDefault(className, "")])
    }>
    {
      switch (image) {
      | None => React.null
      | Some({alt, src}) => <img className="self-start" alt src />
      }
    }
    <BaseHeadline is=BaseHeadline.H3 variant=BaseHeadline.H4>
      {str(title)}
    </BaseHeadline>
    {
      switch (authorLabel) {
      | None => React.null
      | Some(label) =>
        <span> {str(label ++ stringConcat(", ", authors))} </span>
      }
    }
    {
      switch (synopsis) {
      | None => React.null
      | Some(text) => <p> {str(text)} </p>
      }
    }
    <div className="text-right font-bold mb-6">
      {str("Total entries: " ++ string_of_int(entryCount))}
    </div>
    <BaseButton className="self-center" onClick={_e => ()}>
      {str("Add new entry")}
    </BaseButton>
  </div>;
};
