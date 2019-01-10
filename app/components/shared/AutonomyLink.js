import ExternalLink from "./ExternalLink";
import {httpOptions} from "../../config"

export default ({ children, path }) => (
  <ExternalLink
    href={`${httpOptions.autonomyURL.MAINNET}${(path||"")}`}
    hrefTestNet={`${httpOptions.autonomyURL.TESTNET}${(path||"")}`}
  >
    {children}
  </ExternalLink>
);