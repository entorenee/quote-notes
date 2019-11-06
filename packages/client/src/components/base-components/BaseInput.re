open ReactUtils;
open Css;
open Belt;

module Styles = {
  let label = style([marginRight(rem(1.0))]);

  let input = style([padding2(~v=rem(0.5), ~h=rem(1.0))]);
};

type classNameOverrides = {
  wrapper: option(string),
  label: option(string),
};

type inputType =
  | Text
  | Email
  | Password;

[@react.component]
let make =
    (
      ~classNames as optionalClassNames=?,
      ~inputId,
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
  let classNames =
    switch (optionalClassNames) {
    | Some(classes) => classes
    | None => {wrapper: Some(""), label: Some("")}
    };

  <div className={Option.getWithDefault(classNames.wrapper, "")}>
    <label
      className={merge([
        Styles.label,
        Option.getWithDefault(classNames.label, ""),
      ])}
      htmlFor=inputId>
      {str(labelText)}
    </label>
    <input
      className=Styles.input
      id=inputId
      onChange={evt => handleChange(evt)}
      required
      type_
      value
      placeholder
    />
  </div>;
};