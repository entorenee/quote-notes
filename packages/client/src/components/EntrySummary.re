open ReactUtils;

type props = {
  chapter: option(string),
  notes: string,
  title: string,
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
