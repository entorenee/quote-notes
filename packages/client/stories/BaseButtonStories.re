open ReactUtils;
open BsStorybook.Story;
open BsStorybook.Action;

let _module = [%bs.raw "module"];

storiesOf("Button", _module)
->(
    add("default", () => {
      let onClick = action("button clicked");

      <BaseButton onClick> {"Hello World" |> str} </BaseButton>;
    })
  );
