open Belt;

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

let commaSeparateList = String.concat(", ");

let arrHd = Array.get(_, 0);
