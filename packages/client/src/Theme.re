type breakpoints = {
  sm: string,
  md: string,
  lg: string,
  xl: string,
};

type colors = {
  accentLight: Css_Types.Color.t,
  accentDark: Css_Types.Color.t,
  dark: Css_Types.Color.t,
  light: Css_Types.Color.t,
  primary: Css_Types.Color.t,
};

let media = {
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
};

let colors = {
  accentLight: Css.hex("6F91B5"),
  accentDark: Css.hex("AF415B"),
  dark: Css.hex("1E141F"),
  light: Css.hex("F5F7F3"),
  primary: Css.hex("27569D"),
};