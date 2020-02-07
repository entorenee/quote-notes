[@react.component]
let make = (~className="", ~entries) =>
  <div className={Css.merge(["px-4 md:px-8", className])}>
    {
      List.map(
        ({chapter, notes, title}: EntrySummary.props) =>
          <EntrySummary chapter className="mb-6 last:mb-0" notes title />,
        entries,
      )
      |> Array.of_list
      |> React.array
    }
  </div>;
