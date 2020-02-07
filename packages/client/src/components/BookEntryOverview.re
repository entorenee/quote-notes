open ReactUtils;

type bookState = {
  isEditing: bool,
  prevState: option(bookState),
  rating: int,
  synopsis: option(string),
};

type actions =
  | StartEdit
  | CancelEdit
  | SaveEdits
  | SetRating(int)
  | SetSynopsis(string);

[@react.component]
let make =
    (
      ~addEntry,
      ~authors,
      ~bookId,
      ~className="",
      ~entryCount,
      ~rating,
      ~synopsis: option(string),
      ~title,
    ) => {
  let initialState = {isEditing: false, rating, prevState: None, synopsis};
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | StartEdit => {...state, isEditing: true, prevState: Some(state)}
        | CancelEdit => {
            ...Belt.Option.getWithDefault(state.prevState, initialState),
            isEditing: false,
            prevState: None,
          }
        | SaveEdits => {...state, isEditing: false, prevState: None}
        | SetRating(rating) => {...state, rating}
        | SetSynopsis(synopsis) => {...state, synopsis: Some(synopsis)}
        },
      initialState,
    );
  <div
    className={
      Css.merge(["flex flex-col bg-blue-700 text-white px-6 pt-6", className])
    }>
    <Rating
      className="self-end mb-3"
      isEditing={state.isEditing}
      value={state.rating}
      handleUpdate={newRating => dispatch(SetRating(newRating))}
    />
    <BaseHeadline
      className="mb-2" fontColor="text-neutral-100" is=BaseHeadline.H2>
      title->str
    </BaseHeadline>
    {
      switch (Helpers.authorsLabel(authors)) {
      | None => React.null
      | Some(label) =>
        <div className="mb-6">
          <span className="font-semibold mr-2"> label->str </span>
          {stringConcat(", ", authors) |> str}
        </div>
      }
    }
    {
      switch (synopsis) {
      | None => React.null
      | Some(text) => <p className="mb-6 md:max-w-xl"> text->str </p>
      }
    }
    <div className="self-end mb-4">
      {
        switch (state.isEditing) {
        | false => React.null
        | true =>
          <BaseButton
            color=BaseButton.Pink onClick=(_ => dispatch(SaveEdits))>
            "Save Changes"->str
          </BaseButton>
        }
      }
      <BaseButton
        className="mr-3"
        color=BaseButton.Pink
        variant=BaseButton.Tertiary
        onClick={_ => dispatch(state.isEditing ? CancelEdit : StartEdit)}>
        (state.isEditing ? "Cancel Edit" : "Edit")->str
      </BaseButton>
    </div>
    {
      switch (entryCount) {
      | 0 => React.null
      | x =>
        let entryStr = x > 1 ? " entries" : "entry";
        <BaseCard
          className="flex flex-col justify-center w-64 mx-auto bg-white -mb-16"
          shadowSize=BaseCard.Large>
          <div className="self-center text-xl text-black mb-3">
            <span className="font-semibold"> x->string_of_int->str </span>
            <span> entryStr->str </span>
          </div>
          <BaseButton onClick=(_ => addEntry(bookId))>
            "Add new entry"->str
          </BaseButton>
        </BaseCard>;
      }
    }
  </div>;
};
