import localFont from "next/font/local";

const bricolage = localFont({
  src: "../../public/fonts/Bricolage_Grotesque/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-bricolage",
  display: "swap",
  preload: true,
});

const ibmPlex = localFont({
  src: "../../public/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf",
  variable: "--font-ibm-plex",
  display: "swap",
  preload: true,
});

export const fonts = `${bricolage.variable} ${ibmPlex.variable}`;
