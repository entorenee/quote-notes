open ReactUtils;

type swatch = {
  className: string,
  label: string,
};

type swatchGroup = {
  swatches: list(swatch),
  title: string,
};

module ColorSwatchGroup = {
  [@react.component]
  let make = (~className="", ~swatches, ~title) =>
    <div className>
      <div className="text-2xl mb-2"> title->str </div>
      <div className="flex flex-wrap -m-3 lg:-m-6">
        {
          List.map(
            swatch =>
              <div className="flex items-center m-3 lg:m-6">
                <div
                  className={Css.merge(["h-24 w-24 mr-4", swatch.className])}
                />
                <div className="text-xl"> swatch.label->str </div>
              </div>,
            swatches,
          )
          |> Array.of_list
          |> React.array
        }
      </div>
    </div>;
};

[@react.component]
let make = (~swatchGroups) =>
  <div>
    {
      List.map(
        ({swatches, title}) =>
          <ColorSwatchGroup
            key=title
            className="mb-8 last:mb-0"
            swatches
            title
          />,
        swatchGroups,
      )
      |> Array.of_list
      |> React.array
    }
  </div>;
