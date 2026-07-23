import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="term-wrapper" role="main" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="sr-only">
        404 Page Not Found
      </h1>
      <div className="term-line">
        <span className="term-prompt" aria-hidden="true">
          <span className="term-user">visitor</span>
          <span className="term-at">@</span>
          <span className="term-host">sbkoth.github.io</span>
          <span className="term-path">:~$</span>
        </span>{" "}
        <span className="term-cmd">cat /404</span>
      </div>
      <div className="term-output">
        <div className="term-output-line">command not found: page</div>
        <div className="term-output-line">&nbsp;</div>
        <div className="term-output-line">No route matched. Return home and open the terminal:</div>
        <div className="term-output-line">
          <Link href="/" className="text-primary underline underline-offset-2">
            cd /
          </Link>
        </div>
      </div>
    </div>
  );
}
