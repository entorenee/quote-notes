open ReactUtils;
open Css;

[@react.component]
let make = (~className="", ~handleUpdate, ~isEditing=false, ~value) => {
  let allowedRatings = [1, 2, 3, 4, 5];
  let bookRatingStr =
    "Book is rated as " ++ string_of_int(value) ++ " out of 5";
  <div className={merge(["flex", className])}>
    <span className="sr-only"> bookRatingStr->str </span>
    {
      List.map(
        ratingValue => {
          let color = value >= ratingValue ? "text-pink-600" : "text-pink-200";
          <button
            key={string_of_int(ratingValue)}
            type_="button"
            disabled={!isEditing}
            onClick={_ => handleUpdate(ratingValue)}>
            <Icon
              name=Icon.Bookmark
              className={merge(["fill-current w-4 mr-2 last:mr-0", color])}
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
