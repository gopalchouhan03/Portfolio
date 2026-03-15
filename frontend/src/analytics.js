import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-20S6QQJQMJ"); // your measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};