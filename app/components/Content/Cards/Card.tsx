import { type FC } from "react";
import { BlockContent } from "../../Common";
import { type CardType } from "~/types";

const Card: FC<CardType> = ({
  title,
  text,
  cta,
  fromColor,
  toColor,
  enabled,
}) => (
  <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
    <a
      className="w-full flex"
      href={cta.route?.slug?.current ?? cta.link ?? ""}
    >
      <div
        className={`w-full flex md:flex-col bg-gradient-to-br ${
          !enabled ? `from-gray-700 to-gray-500` : `${fromColor} ${toColor}`
        } `}
      >
        <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative p-6 xl:p-8">
          <h2 className="text-xl font-semibold mb-2 text-shadow">{title}</h2>
          <div className="font-medium text-violet-100 text-shadow mb-4">
            <BlockContent text={text} />
          </div>
          <p className="mt-auto">{cta.title}</p>
        </div>
      </div>
    </a>
  </div>
);

export default Card;
