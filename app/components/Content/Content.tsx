import { type FC } from "react";
import { ContextDataContextProvider, SanityContextProvider } from "~/contexts";
import type { PreviewContent, Content, Colors, ContextData } from "~/types";
import Banner from "./Banner";
import Cards from "./Cards";
import ContentPreview from "./ContentPreview";
import Hero from "./Hero";
import ImageSection from "./ImageSection";
import Share from "./Share";

import Tags from "./Tags";
import TextSection from "./TextSection";

const ContentComponent: FC<Props> = ({
  content,
  contextData,
  previewContent,
  sanityDataset,
  sanityProjectId,
  colors,
}) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <SanityContextProvider
      sanityDataset={sanityDataset}
      sanityProjectId={sanityProjectId}
    >
      <ContextDataContextProvider contextData={contextData}>
        <div className="min-h-screen">
          {content.map((item) => {
            switch (item._type) {
              case "hero":
                return <Hero key={item._key} colors={colors} {...item} />;
              case "cards":
                return <Cards key={item._key} {...item} />;
              case "banner":
                return <Banner key={item._key} colors={colors} {...item} />;
              case "tags":
                return <Tags key={item._key} {...item} />;
              case "textSection":
                return <TextSection key={item._key} {...item} />;
              case "imageSection":
                return <ImageSection key={item._key} {...item} />;
              case "contentPreview":
                return (
                  <ContentPreview
                    key={item._key}
                    {...item}
                    data={previewContent}
                  />
                );
              case "shareSection":
                return <Share key={item._key} colors={colors} {...item} />;
              default:
                return null;
            }
          })}
        </div>
      </ContextDataContextProvider>
    </SanityContextProvider>
  );
};

interface Props {
  content: Content[];
  contextData: ContextData;
  colors: Colors;
  previewContent: Record<string, PreviewContent[]>;
  sanityDataset: string;
  sanityProjectId: string;
}

export default ContentComponent;
