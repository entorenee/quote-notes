open ReactUtils;

type props = {
  chapter: option(string),
  notes: string,
  title: string,
};

module Placeholder = {
  [@react.component]
  let make = (~className="") =>
    <BaseCard className={Css.merge(["bg-white flex flex-col", className])}>
      <div
        className="bg-neutral-500 w-24 sm:w-32 h-6 mb-6 inline-block self-end rounded"
      />
      <div className="bg-neutral-700 w-40 sm:w-64 h-6 mb-6 rounded" />
      <div className="bg-neutral-300 w-3/4 h-6 rounded" />
    </BaseCard>;
};

[@react.component]
let make = (~chapter, ~className="", ~notes, ~title) =>
  <BaseCard className={Css.merge(["bg-white", className])}>
    {
      switch (chapter) {
      | Some(text) => <div className="text-right"> text->str </div>
      | None => React.null
      }
    }
    <BaseHeadline className="mb-2" is=BaseHeadline.H4 variant=BaseHeadline.H3>
      title->str
    </BaseHeadline>
    <p className="pr-4 md:pr-8 md:max-w-2xl"> notes->str </p>
  </BaseCard>;
