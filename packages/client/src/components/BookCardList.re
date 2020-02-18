open Belt;

module Styles = {
  open Css;
  open Theme;

  let card =
    style([
      margin2(~v=Spacer.sp04, ~h=zero),
      media(
        Media.sm,
        [
          marginRight(Spacer.sp04),
          marginLeft(Spacer.sp04),
          maxWidth(Calc.(-)(pct(33.33), Spacer.sp04)),
          flex3(~grow=1.0, ~shrink=1.0, ~basis=`percent(27.0)),
        ],
      ),
    ]);
};

[@react.component]
let make = (~books) =>
  <div className="flex flex-col md:flex-row md:flex-wrap">
    {
      React.array(
        Array.map(
          books, ({authors, entryCount, image, synopsis, title}: BookCard.t) =>
          <BookCard
            className=Styles.card
            key=title
            authors
            entryCount
            image
            synopsis
            title
          />
        ),
      )
    }
  </div>;
