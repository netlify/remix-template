import { type BannerContent, type WithColors } from "~/types";
import { type FC } from "react";
import { Ctas } from "../CommonContent";

const Banner: FC<
  WithColors<Pick<BannerContent, "heading" | "subHeading" | "ctas">>
> = ({ heading, subHeading, ctas, colors }) => (
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="block">{heading}</span>
        <span className="block" style={{ color: colors.primary.hex }}>
          {subHeading}
        </span>
      </h2>
      <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <Ctas ctas={ctas} />
      </div>
    </div>
  </div>
);

export default Banner;
