/* Twitter reads `twitter:image` and ignores `og:image`, so the same sheet is
   served under both names rather than letting one of the two unfurl bare. */
export { alt, size, contentType, default } from "./opengraph-image";
