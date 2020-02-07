let flatten = x =>
  switch (x) {
  | None => None
  | Some(None) => None
  | Some(Some(x)) => Some(x)
  };

let authorsLabel = authorCount =>
  switch (List.length(authorCount)) {
  | 0 => None
  | 1 => Some("Author:")
  | _ => Some("Authors:")
  };
