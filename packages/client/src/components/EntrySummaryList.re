open ReactUtils;

[@react.component]
let make = (~className="", ~entries) =>
  <div className={Css.merge(["px-4 md:px-8", className])}>
    {
      switch (List.length(entries)) {
      | 0 =>
        <>
          <EntrySummary.Placeholder />
          <div className="mt-12 md:w-1/2 mx-auto flex flex-col items-center">
            <p className="font-bold text-lg md:text-xl mb-4">
              {"No entries created yet" |> str}
            </p>
            <p className="text-neutral-600 w-3/4 mx-auto mb-6 text-center">
              {
                "Once you create an entry, all entries for this book will appear here."
                |> str
              }
            </p>
            <a href="/" className="btn btn-primary-blue">
              {"Create a new entry" |> str}
            </a>
          </div>
        </>
      | _ =>
        List.map(
          ({chapter, notes, title}: EntrySummary.props) =>
            <EntrySummary chapter className="mb-6 last:mb-0" notes title />,
          entries,
        )
        |> reactArray
      }
    }
  </div>;
