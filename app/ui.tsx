import { Link as Link_ } from "react-router-dom";
import { styled } from "./stitches.config.ts";

export const Link = styled(Link_, {
  color: "$indigo500",
  textDecorationLine: "underline",
  "@dark": {
    color: "$indigo400",
  },
});

export const ExternalLink = styled("a", {
  color: "$indigo600",
  textDecoration: "underline",
  "&:hover": {
    color: "$indigo500",
  },
  "@dark": {
    color: "$indigo400",
    "$:hover": {
      color: "$indigo300",
    },
  },
});

export const Img = styled("img", {});

export const H1 = styled("h1", {
  fontSize: "$xl",
  lineHeight: "$xl",
  fontWeight: "bold",
});

export const H2 = styled("h2", {
  fontSize: "$2xl",
  lineHeight: "$2xl",
  fontWeight: "$semibold",
});

export const Divider = styled("hr", {
  borderTop: "$gray900",
  borderTopWidth: "1px",
});

export const P = styled("p", {});

export const Ul = styled("ul", {
  textAlign: "left",
});

export const Li = styled("li", {});

export const Container = styled("div", {
  px: "$3",
  py: "$6",
  mx: "$auto",
  textAlign: "center",
  maxWidth: "36rem",
});

export const Button = styled("button", {
  px: "$2",
  py: "$1",
  borderRadius: "$md",
  backgroundColor: "$gray200",
  color: "$gray900",
  "&:hover": {
    backgroundColor: "$gray100",
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  "@dark": {
    backgroundColor: "$gray700",
    color: "$gray50",
    "&:hover": {
      backgroundColor: "$gray800",
    },
  },
});

export const Body = styled("body", {
  backgroundColor: "$gray50",
  color: "$gray900",
});
