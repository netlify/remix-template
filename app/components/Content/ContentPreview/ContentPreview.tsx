import { Link } from "@remix-run/react";
import { type FC } from "react";
import { BlockContent } from "../../Common";
import { type Tag, type ContentPreview } from "~/types";
import { Image } from "../CommonContent";

import Tags from "../Tags";

const getTags = (previewTags: { tags: Tag[] }[]): Tag[] => {
  return previewTags
    .reduce((acc: Tag[], o: { tags: Tag[] }) => {
      acc = acc.concat(o?.tags);
      return acc;
    }, [])
    .map(({ title, media }, idx) => {
      return {
        _key: `${title}-${idx}`,
        title,
        media,
      };
    });
};

const ContentPreviewComponent: FC<
  Pick<ContentPreview, "data" | "parentRoute" | "heading">
> = ({ data, parentRoute, heading }) => {
  if (!data || !data[parentRoute.slug.current]) {
    return null;
  }
  return (
    <div className="m-2 mb-8 mx-auto px-4 z-0">
      {heading ? (
        <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          {heading}
        </h2>
      ) : null}
      <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8 ">
        {data[parentRoute.slug.current].map(
          ({ _id, title, description, openGraphImage, slug, previewTags }) => (
            <li key={_id}>
              <div className="m-1 max-w-sm sm:w-auto sm:h-[420px] rounded overflow-hidden shadow-lg">
                <Link
                  prefetch="intent"
                  to={`${parentRoute.slug.current}/${slug.current}`}
                >
                  <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative p-6 xl:p-8">
                    {openGraphImage ? (
                      <Image
                        className="max-w-sm m-auto z-0"
                        value={openGraphImage}
                        alt={title}
                        width={300}
                        height={168}
                        fit={"clip"}
                      />
                    ) : (
                      <div className="h-[168px]" />
                    )}
                    <h2 className="font-bold text-xl mb-2">{title}</h2>
                    <div className="text-gray-700 text-base mb-2">
                      {description ? <BlockContent text={description} /> : null}
                    </div>
                    <div className="h-24 m-1 overflow-hidden">
                      {previewTags ? (
                        <Tags
                          ariaLabel="keywords"
                          tags={getTags(previewTags)}
                          preview
                        />
                      ) : null}
                    </div>
                  </div>
                </Link>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ContentPreviewComponent;
