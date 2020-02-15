open ReactUtils;
open Helpers;
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
    <BaseHeadline
      className="mt-4 mb-2" is=BaseHeadline.H3 variant=BaseHeadline.H4>
      title->str
    </BaseHeadline>
    {
      switch (authorLabel) {
      | None => React.null
      | Some(label) =>
        <div className="mb-2">
          <span className="font-semibold"> label->str </span>
          {authors |> commaSeparateList |> str}
        </div>
      }
    }
    {
      switch (synopsis) {
      | None => React.null
      | Some(text) => <p> text->str </p>
      }
    }
    <div className="text-right font-bold mt-2 mb-6">
      {"Total entries: " ++ string_of_int(entryCount) |> str}
    </div>
    <BaseButton className="self-center" onClick={_e => ()}>
      "Add new entry"->str
    </BaseButton>
  </div>;
};
