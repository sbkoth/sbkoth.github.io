import { COMMANDS } from "./commands";
import { PORTRAIT_ART, SBKOTH_LOGO, SBKOTH_LOGO_MOBILE } from "./welcome-art";

type Props = {
  name: string;
};

/**
 * Hero for `welcome`: wordmark left, terminal portrait art only (no photo),
 * plus the full help menu so visitors need not type `help` first.
 */
export default function WelcomeBanner({ name }: Props) {
  return (
    <div className="welcome-banner" data-testid="welcome-banner">
      <div className="welcome-banner-row">
        <div className="welcome-logo-col">
          <pre className="welcome-pre welcome-logo-desktop" aria-hidden>
            {SBKOTH_LOGO.join("\n")}
          </pre>
          <pre className="welcome-pre welcome-logo-mobile" aria-hidden>
            {SBKOTH_LOGO_MOBILE.join("\n")}
          </pre>
        </div>

        <div className="welcome-art-col" aria-hidden>
          <pre className="welcome-pre welcome-portrait">{PORTRAIT_ART.join("\n")}</pre>
          <div className="welcome-art-caption">{"// operator"}</div>
        </div>
      </div>

      <div className="welcome-copy">
        <div>Welcome to {name}&apos;s terminal portfolio.</div>
        <div className="welcome-sep">----</div>
        <div className="welcome-help" data-testid="welcome-help">
          <div className="welcome-help-title">Available commands</div>
          <ul className="welcome-help-list">
            {COMMANDS.map((c) => (
              <li key={c.cmd} className="welcome-help-line">
                <span className="welcome-cmd">{c.cmd}</span>
                <span className="welcome-help-desc">— {c.desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="welcome-keys">Tab / Ctrl+I autocomplete · ↑/↓ history · Ctrl+L clear</div>
        <div className="welcome-sep">----</div>
      </div>
    </div>
  );
}
