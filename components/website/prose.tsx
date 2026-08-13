import { Fragment } from "react";

export default function Prose({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim() !== "");

  return (
    <div className="typeset">
      {blocks.map((block, i) => (
        <p key={i}>
          {block.split("\n").map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}