let str = React.string;

let stringConcat = (char, list) =>
  switch (List.length(list)) {
  | 0 => raise(Failure("Empty List provided"))
  | _ =>
    List.fold_left((a, b) => a ++ char ++ b, List.hd(list), List.tl(list))
  };