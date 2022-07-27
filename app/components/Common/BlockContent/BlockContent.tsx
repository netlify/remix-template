import { type FC } from "react";
import { PortableText } from "@portabletext/react";
import { type PortableTextBlock } from "@portabletext/types";

import CodeBlock from "./CodeBlock";
import Figure from "./Figure";

const components = {
  types: {
    figure: Figure,
    code: CodeBlock,
  },
};

const BlockContent: FC<{ text: PortableTextBlock[] }> = ({ text }) => (
  <PortableText value={text} components={components} />
);

export default BlockContent;
