import { type FC } from "react";
import { type TextSectionContent } from "~/types";
import { BlockContent } from "../../Common";

const TextSection: FC<Pick<TextSectionContent, "text">> = ({ text }) => (
  <section className="m-4">
    <div className="w-full m-auto mt-5 text-base text-gray-900 prose">
      <BlockContent text={text} />
    </div>
  </section>
);

export default TextSection;
