let str = React.string;

type inputType =
  | Text
  | Email
  | Password;

[@react.component]
let make =
    (
      ~labelText,
      ~onChange,
      ~placeholder,
      ~required=false,
      ~type_ as iType=Text,
      ~value,
    ) => {
  let handleChange = evt => ReactEvent.Form.target(evt)##value->onChange;
  let type_ =
    switch (iType) {
    | Text => "text"
    | Email => "email"
    | Password => "password"
    };

  <label>
    {str(labelText)}
    <input
      onChange={evt => handleChange(evt)}
      required
      type_
      value
      placeholder
    />
  </label>;
};
