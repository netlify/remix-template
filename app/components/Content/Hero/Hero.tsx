import type { HeroContent, WithColors } from "~/types";
import { type FC } from "react";

import { PortableText } from "@portabletext/react";
import { Ctas, Image } from "../CommonContent";

const Hero: FC<
  WithColors<
    Pick<HeroContent, "heading" | "subHeading" | "tagline" | "ctas" | "image">
  >
> = ({ heading, subHeading, tagline, ctas, image, colors }) => {
  return (
    <section className={`md:${image ? "columns-2" : "columns-1"}`}>
      <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div
          className={`sm:text-center lg:${image ? "text-left" : "text-center"}`}
        >
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">{heading}</span>
            <span
              className="block xl:inline"
              style={{ color: colors.primary.hex }}
            >
              {subHeading}
            </span>
          </h1>
          <div className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            {tagline ? <PortableText value={tagline} /> : null}
          </div>

          {ctas && (
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <Ctas ctas={ctas} />
            </div>
          )}
        </div>
      </div>

      {image && (
        <Image
          className="h-56 w-full object-cover sm:h-72 md:h-96  lg:w-full lg:h-full "
          value={image}
          alt={image.alt}
          loading="eager"
          width={350}
          height={250}
        />
      )}
    </section>
  );
};

export default Hero;
