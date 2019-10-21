open BsStorybook.Story;

let _module = [%bs.raw "module"];

storiesOf("Search", _module)->(add("default", () => <Search />));