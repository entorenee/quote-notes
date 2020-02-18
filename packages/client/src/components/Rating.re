open ReactUtils;
open Css;

[@react.component]
let make = (~className="", ~handleUpdate, ~isEditing=false, ~value) => {
  let (highlightedValue, setHighlightedValue) = React.useState(() => value);
  React.useEffect2(
    () => {
      // Reset back to value if not editing or value changes
      if (!isEditing) {
        setHighlightedValue(_ => value);
      };
      None;
    },
    (isEditing, value),
  );

  let updateHighlightedValue = value =>
    if (isEditing) {
      setHighlightedValue(_ => value);
    };

  let allowedRatings = [1, 2, 3, 4, 5];
  let bookRatingStr =
    "Book is rated as " ++ string_of_int(value) ++ " out of 5";
  <div
    className={merge(["flex", className])}
    onMouseLeave={_ => updateHighlightedValue(value)}
    onBlur={_ => updateHighlightedValue(value)}
    >
    <span className="sr-only"> bookRatingStr->str </span>
    {
      List.map(
        ratingValue => {
          let color =
            highlightedValue >= ratingValue ?
              "text-brown-400" : "text-brown-200";
          <button
            key={string_of_int(ratingValue)}
            type_="button"
            disabled={!isEditing}
            onClick={_ => handleUpdate(ratingValue)}
            onMouseEnter={_ => updateHighlightedValue(ratingValue)}
            onFocus={_ => updateHighlightedValue(ratingValue)}>
            <Icon
              name=Icon.Bookmark
              className={merge(["fill-current w-5 mr-2 last:mr-0 transition-colors duration-300", color])}
            />
            <span className={isEditing ? "sr-only" : "hidden"}>
              ("Rate book as " ++ string_of_int(ratingValue) ++ " out of 5")
              ->str
            </span>
          </button>;
        },
        allowedRatings,
      )
      |> Array.of_list
      |> React.array
    }
  </div>;
};
