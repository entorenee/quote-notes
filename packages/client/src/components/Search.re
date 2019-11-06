open ReactUtils;

module Styles = {
  open Css;

  let wrapper = style([width(fitContent)]);

  let inputOverrides: BaseInput.classNameOverrides = {
    wrapper: Some(style([display(flexBox), flexDirection(column)])),
    label: Some(style([marginBottom(rem(1.0))])),
  };

  let activeButton = isActive =>
    style([backgroundColor(isActive ? pink : white)]);
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
      {List.map(
         button =>
           <BaseButton
             key=button
             className={Styles.activeButton(active == button)}
             onClick={_evt => handleActive(button)}>
             {str(button)}
           </BaseButton>,
         buttons,
       )
       ->Array.of_list
       ->React.array}
    </div>
  </div>;
};