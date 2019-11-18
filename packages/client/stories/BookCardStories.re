open BsStorybook.Story;

let _module = [%bs.raw "module"];

let cards: list(BookCard.props) = [
  {
    authors: ["Nathaniel Hawthorne"],
    className: None,
    entryCount: 4,
    image: Some({src: "https://via.placeholder.com/150", alt: "test"}),
    synopsis: "An \"A\" for \"adultery\" marks Hester Prynne as an outcast from the society of colonial Boston. Although forced by the puritanical town fathers to wear a bright red badge of shame, Hester steadfastly resists their efforts to discover the identity of her baby's father. The return of her long-absent spouse brings new pressure on the young mother, as the aggrieved husband undertakes a long-term plot to reveal Hester's partner in adultery and force him to share her disgrace.",
    title: "The Scarlet Letter",
  },
  {
    authors: ["Marty Cagan"],
    className: None,
    entryCount: 4,
    image: Some({src: "https://via.placeholder.com/150", alt: "test"}),
    synopsis: "How do today's most successful tech companies--Amazon, Google, Facebook, Netflix, Tesla--design, develop, and deploy the products that have earned the love of literally billions of people around the world? Perhaps surprisingly, they do it very differently than the vast majority of tech companies. In INSPIRED, technology product management thought leader Marty Cagan provides readers with a master class in how to structure and staff a vibrant and successful product organization, and how to discover and deliver technology products that your customers will love--and that will work for your business.",
    title: "Inspired: How to Create Tech Products Customers Love",
  },
  {
    authors: ["Suzanne Collins"],
    className: None,
    entryCount: 4,
    image: Some({src: "https://via.placeholder.com/150", alt: "test"}),
    synopsis: "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by 12 outlying districts. The Capitol keeps the districts in line by forcing them all to send one boy and one girl between the ages of 12 and 18 to participate in the annual Hunger Games, a fight to the death on live TV.",
    title: "The Hunger Games",
  },
  {
    authors: ["Lin-Manuel Miranda", "Jeremy McCarter"],
    className: None,
    entryCount: 4,
    image: None,
    synopsis: "Lin-Manuel Miranda's groundbreaking musical Hamilton is as revolutionary as its subject, the poor kid from the Caribbean who fought the British, defended the Constitution, and helped to found the United States. Fusing hip-hop, pop, R&B, and the best traditions of theater, this once-in-a-generation show broadens the sound of Broadway, reveals the storytelling power of rap, and claims our country's origins for a diverse new generation.",
    title: "Hamilton: The Revolution",
  },
];

storiesOf("Book Card", _module)
->(
    add("default", () =>
      <BookCard
        authors=["Charles Dickens"]
        entryCount=4
        image=None
        synopsis="Hello"
        title="My Book Title"
      />
    )
  )
->(add("List", () => <BookCardList books=cards />));