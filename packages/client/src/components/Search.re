open ReactUtils;

module Styles = {
  open Css;

  let wrapper = style([width(fitContent)]);

  let inputOverrides: BaseInput.classNameOverrides = {
    wrapper: Some("flex flex-col"),
    label: Some("mb-4"),
  };
};

let buttons = ["Title", "Author", "ISBN"];

[@react.component]
let make = () => {
  let (search, updateSearch) = React.useState(() => "");
  let (active, setActive) = React.useState(() => "Title");

  let handleActive = category => setActive(_ => category);

  <div className=Styles.wrapper>
    <BaseInput
      classNames=Styles.inputOverrides
      inputId="book-search-text"
      labelText="Search"
      onChange=updateSearch
      value=search
      placeholder="Search for books"
    />
    <div>
      {
        List.map(
          button =>
            <BaseButton
              key=button
              className={active == button ? "bg-pink-500" : ""}
              onClick={_evt => handleActive(button)}>
              {str(button)}
            </BaseButton>,
          buttons,
        )
        |> Array.of_list
        |> React.array
      }
    </div>
  </div>;
};
