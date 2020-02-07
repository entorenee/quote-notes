open BsStorybook.Story;
open BsStorybook.Action;

let _module = [%bs.raw "module"];

storiesOf("Inputs", _module)
->(
    add("Input", () => {
      let onChange = action("Character typed");

      <BaseInput
        inputId="sample-id"
        labelText="Sample label"
        onChange
        placeholder="Type here"
        required=false
        type_=BaseInput.Text
        value=""
      />;
    })
  )
->add("Text Area", () => {
    let onChange = action("Character typed");
    <TextArea value="My text area element" onChange />;
  });
