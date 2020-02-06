open BsStorybook.Story;
open BsStorybook.Action;
let str = React.string;

let _module = [%bs.raw "module"];

storiesOf("Button", _module)
->(
    add("default", () => {
      let onClick = action("button clicked");

      <BaseButton onClick> {str("Hello World")} </BaseButton>;
    })
  );
