open BsStorybook.Story;

let _module = [%bs.raw "module"];

let addEntry = id => Js.log(id);
let authors = ["Nathaniel Hawthorne"];
let synopsis = "Set in Puritan Massachusetts Bay Colony during the years 1642 to 1649, the novel tells the story of Hester Prynne who conceives a daughter through an affair and then struggles to create a new life of repentance and dignity. Containing a number of religious and historic allusions, the book explores themes of legalism, sin, and guilt.";

storiesOf("Book Entry Overview", _module)
->add("default", () =>
    <BookEntryOverview
      addEntry
      authors
      bookId=123
      entryCount=12
      rating=3
      synopsis
      title="The Scarlet Letter"
    />
  );
