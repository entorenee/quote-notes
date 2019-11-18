open Css;

module Media = {
  let sm = "(min-width: 576px)";
  let md = "(min-width: 768px)";
  let lg = "(min-width: 992px)";
  let xl = "(min-width: 1200px)";
};

module Colors = {
  let accentLight = hex("6F91B5");
  let accentDark = hex("AF415B");
  let dark = hex("1E141F");
  let light = hex("F5F7F3");
  let primary = hex("27569D");
};

module FontSize = {
  let xs = rem(0.75);
  let sm = rem(0.875);
  let base = rem(1.0);
  let lg = rem(1.125);
  let xl = rem(1.25);
  let xl2 = rem(1.5);
  let xl3 = rem(1.875);
  let xl4 = rem(2.25);
  let xl5 = rem(3.0);
  let xl6 = rem(4.0);
};

module Spacer = {
  let sp01 = rem(0.5);
  let sp02 = rem(1.0);
  let sp03 = rem(1.5);
  let sp04 = rem(2.0);
  let sp05 = rem(2.5);
  let sp06 = rem(3.0);
  let sp07 = rem(3.5);
  let sp08 = rem(4.0);
  let sp10 = rem(5.0);
  let sp12 = rem(6.0);
  let sp16 = rem(8.0);
  let sp20 = rem(10.0);
  let sp24 = rem(12.0);
  let sp28 = rem(14.0);
  let sp32 = rem(16.0);
};