type singleBook = {
  authors: list(string),
  id: string,
  entryCount: int,
  rating: option(int),
  synopsis: option(string),
  title: string,
};

[@react.component]
let make = (~book, ~className="", ~entries) => {
  let addEntry = id => Js.log(id);
  <div className={Css.merge(["bg-neutral-200", className])}>
    <BookEntryOverview
      className="mb-32"
      addEntry
      authors={book.authors}
      bookId={book.id}
      entryCount={book.entryCount}
      rating={book.rating}
      synopsis={book.synopsis}
      title={book.title}
    />
    <EntrySummaryList entries />
  </div>;
};
