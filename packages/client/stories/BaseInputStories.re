open BsStorybook.Story;
open BsStorybook.Action;

let _module = [%bs.raw "module"];

storiesOf("Input", _module)
->(
    add("default", () => {
      let onChange = action("Character typed");

      <BaseInput
        labelText="Sample label"
        onChange
        placeholder="Type here"
        required=false
        type_=BaseInput.Text
        value=""
      />;
    })
  );
