open BsStorybook.Story;
open List;
let _module = [%bs.raw "module"];

let addEntry = id => Js.log(id);
let authors = ["Nathaniel Hawthorne"];
let synopsis =
  Some(
    "Set in Puritan Massachusetts Bay Colony during the years 1642 to 1649, the novel tells the story of Hester Prynne who conceives a daughter through an affair and then struggles to create a new life of repentance and dignity. Containing a number of religious and historic allusions, the book explores themes of legalism, sin, and guilt.",
  );

let cards: list(EntrySummary.props) = [
  {
    chapter: Some("Chapter 1"),
    title: "Intriguing Revelations",
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    chapter: Some("Chapter 2"),
    title: "Thought provoking title",
    notes: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {chapter: None, title: "Chapter in Progress", notes: ""},
];

let book: BookEntryList.singleBook = {
  authors,
  id: "123",
  entryCount: 12,
  rating: Some(3),
  synopsis,
  title: "The Scarlet Letter",
};

storiesOf("Book Entry List", _module)
->add("default", () => <BookEntryList book entries=cards />)
->add("Book Entry Overview", () =>
    <BookEntryOverview
      addEntry
      authors
      bookId=123
      entryCount=12
      rating={Some(3)}
      synopsis
      title="The Scarlet Letter"
    />
  )
->(
    add("Entry Summary", () =>
      <EntrySummary
        chapter={hd(cards).chapter}
        title={hd(cards).title}
        notes={hd(cards).notes}
      />
    )
  )
->(add("Entry Summary List", () => <EntrySummaryList entries=cards />));
