import { type FC } from "react";
import urlBuilder from "@sanity/image-url";
import {
  getImageDimensions,
  type SanityImageSource,
} from "@sanity/asset-utils";
import { useSanityContext } from "~/contexts";

const Figure: FC<Props> = ({ value, isInline }) => {
  const { sanityDataset, sanityProjectId } = useSanityContext();
  const { width, height } = getImageDimensions(value);

  return (
    <img
      src={urlBuilder({
        clientConfig: {
          dataset: sanityDataset,
          projectId: sanityProjectId,
        },
      })
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={(value as { alt?: string })?.alt || " "}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: `${width}/${height}`,
      }}
    />
  );
};

interface Props {
  value: SanityImageSource;
  isInline: boolean;
}

export default Figure;
