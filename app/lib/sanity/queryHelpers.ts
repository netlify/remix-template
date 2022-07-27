import type {
  ContentPreview,
  Content as ContentItem,
  PageData,
  LoadableContent,
  PageContent,
} from "~/types";
import { getSanityClient } from "./client";

const contentQuery = ` ...,
            content[] {
              ...,
              parentRoute->,
              query->,
              cards[] {
                ...,
                cta {
                  ...,
                  route->
                }
              },
              tags[] {
                ...,
                route->,
                media {
                  asset->
                }
              }

            },
            openGraphImage {
              asset->
            }
`;

export const queryHelper = (
  paramValue: string | undefined
): {
  query: string;
  queryParams: Record<string, unknown>;
} => {
  return paramValue && paramValue?.split("/").length > 1
    ? {
        query: `*[_type == "page" && slug.current == $slug][0]
        {  ${contentQuery}
      }`,
        queryParams: {
          slug: paramValue?.split("/")[paramValue.split("/").length - 1] ?? "/",
        },
      }
    : {
        query: `*[_type == "route" && slug.current == $slug][0]
        { ..., 
          page->{
            ${contentQuery}
          }
      }`,
        queryParams: { slug: paramValue ?? "/" },
      };
};

const isContentPreview = (item: unknown): item is ContentPreview => {
  return (item as ContentPreview)._type === "contentPreview";
};

const loadableContent = (content: ContentItem[]) => {
  if (!content) {
    return [];
  }

  return content
    .filter((ci: ContentItem): ci is ContentPreview => isContentPreview(ci))
    .map((i) => {
      return {
        root: i.parentRoute.slug.current,
        query: i.query,
        params: i.params,
      };
    });
};

const isPage = (data: unknown): data is PageData => {
  return (data as PageData).page !== undefined;
};

export const getPageData = async (
  query: string,
  queryParams: Record<string, unknown>,
  preview = false
) => {
  const data = await getSanityClient(preview).fetch<
    PageData | PageContent | null
  >(query, queryParams);

  if (!data) return { pageData: null, previewData: null };

  const pageData = isPage(data) ? data.page : data;

  const contentToLoad = loadableContent(pageData.content);
  const previewData = await getPreviewContent(contentToLoad);
  return { pageData, previewData };
};

const getPreviewContent = async (
  contentToLoad: LoadableContent[],
  preview = false
) => {
  let previewContent;
  if (contentToLoad.length > 0) {
    const previewContentData = await Promise.all(
      contentToLoad.map(async (toLoad: LoadableContent) => {
        const d = await getSanityClient(preview).fetch(
          toLoad.query.queryCode.code,
          {
            slug: toLoad.root,
          }
        );
        return { [toLoad.root]: d };
      })
    );

    previewContent = previewContentData?.reduce((a, v) => {
      return { ...a, ...v };
    }, {});
  }
  return previewContent;
};
