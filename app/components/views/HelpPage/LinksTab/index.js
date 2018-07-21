import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import { HelpLink, HelpLinkInfoModal } from "buttons";
import { ConstitutionModalContent } from "modals";
import "style/Help.less";

const Links = () => (
  <Aux>
    <div className="tab-card">
      <div className={"help-icon-row"}>
        <HelpLink className={"help-github-icon"} href="https://github.com/HcashOrg/hcGUI"><T id="help.github" m="Github" /></HelpLink>
        <HelpLink className={"help-docs-icon"} href="http://wiki.h.cash/"><T id="help.documentation" m="Documentation" /></HelpLink>
      </div>
      <div className={"help-icon-row"}>
        <HelpLink className={"help-forum-icon"} href="https://forum.h.cash"><T id="help.forum" m="Forum" /> </HelpLink>
        <HelpLinkInfoModal className={"help-constitution-icon"}
          modalTitle={<h1><T id="help.constitution.modal.title" m="HC Constitution" /></h1>}
          modalContent={<ConstitutionModalContent />}
          buttonLabel={<T id="help.constitution" m="Constitution" />}
        />
      </div>
    </div>
  </Aux>
);

export default Links;
