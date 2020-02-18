open ReactUtils;
open Belt;

type swatch = {
  className: string,
  label: string,
};

type swatchGroup = {
  swatches: array(swatch),
  title: string,
};

module ColorSwatchGroup = {
  [@react.component]
  let make = (~className="", ~swatches, ~title) =>
    <div className>
      <div className="text-2xl mb-2"> title->str </div>
      <div className="flex flex-wrap -m-3 lg:-m-6">
        {
          React.array(
            Array.map(swatches, swatch =>
              <div className="flex items-center m-3 lg:m-6">
                <div
                  className={Css.merge(["h-24 w-24 mr-4", swatch.className])}
                />
                <div className="text-xl"> swatch.label->str </div>
              </div>
            ),
          )
        }
      </div>
    </div>;
};

[@react.component]
let make = (~swatchGroups) =>
  <div>
    {
      React.array(
        Array.map(swatchGroups, ({swatches, title}) =>
          <ColorSwatchGroup
            key=title
            className="mb-8 last:mb-0"
            swatches
            title
          />
        ),
      )
    }
  </div>;
