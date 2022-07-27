import { type FC } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock: FC<{ value: { language: string; code: string } }> = ({
  value,
}) => {
  return (
    <SyntaxHighlighter language={value.language}>
      {value.code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
