import { type FC } from "react";
import urlBuilder from "@sanity/image-url";
import {
  getImageDimensions,
  type SanityImageSource,
} from "@sanity/asset-utils";
import { type FitMode } from "@sanity/image-url/lib/types/types";
import { useSanityContext } from "~/contexts";

const Image: FC<Props> = ({
  className,
  value,
  isInline,
  alt,
  width,
  height,
  loading = "lazy",
  fit = "max",
}) => {
  const { sanityDataset, sanityProjectId } = useSanityContext();
  const { width: imageWidth, height: imageHeight } = getImageDimensions(value);
  return (
    <img
      className={className}
      src={urlBuilder({
        clientConfig: {
          dataset: sanityDataset,
          projectId: sanityProjectId,
        },
      })
        .image(value)
        .width(width ?? imageWidth)
        .height(height ?? imageHeight)
        .fit(fit)
        .auto("format")
        .url()}
      alt={alt || (value as { alt?: string })?.alt || " "}
      loading={loading}
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: `${width ?? imageWidth}/${height ?? imageHeight}`,
      }}
      width={width ?? imageWidth}
      height={height ?? imageHeight}
    />
  );
};

interface Props {
  className?: string;
  value: SanityImageSource;
  isInline?: boolean;
  alt: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  fit?: FitMode;
}

export default Image;
