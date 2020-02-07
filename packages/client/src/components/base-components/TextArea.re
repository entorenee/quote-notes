open ReactUtils;

[@react.component]
let make = (~className="", ~cols=60, ~onChange, ~rows=7, ~value) => {
  let handleChange = evt => ReactEvent.Form.target(evt)##value->onChange;
  <textarea
    className={Css.merge(["p-3 border-2 border-neutral-800", className])}
    cols
    onChange={e => handleChange(e)}
    rows>
    value->str
  </textarea>;
};
