import { toPlainText } from "@portabletext/react";
import {
  type MetaFunction,
  type LoaderFunction,
} from "@remix-run/server-runtime";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { Content } from "~/components";

import { getPageData, queryHelper } from "~/lib";
import type { ContextData, Colors, PageContent, PreviewContent } from "~/types";

export const meta: MetaFunction = ({ data, parentsData }) => {
  if (!data || !data.pageData) {
    return {
      title: `${parentsData?.root.title} | No title`,
      description: "No description found",
    };
  }
  const { pageData } = data;
  return {
    title: `${parentsData?.root.title} | ${pageData.title}`,
    description: `${
      pageData.description ? toPlainText(pageData.description) : ""
    }`,
    keywords: `${pageData?.keywords ? pageData.keywords?.join(",") : ""}`,
    "og:image": `${
      pageData?.openGraphImage ? pageData?.openGraphImage.asset.url : ""
    }`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);

  const { query, queryParams } = queryHelper(params["*"]);

  const { pageData, previewData } = await getPageData(query, queryParams);
  if (!pageData) {
    throw new Error(`PageData missing for ${requestUrl}`);
  }
  return {
    pageData,
    previewData,
    requestUrl,
  };
};

export const ErrorBoundary = () => {
  return (
    <div className="flex flex-col m-2 h-screen text-center items-center">
      <div>Something's gone wrong</div>
      <Link
        to="/"
        className="mt-2 p-3 flex items-center rounded-md border-2 border-gray-300 hover:bg-gray-50"
      >
        <span className="mx-4 text-base font-medium">Home</span>
      </Link>
    </div>
  );
};

export default function Body() {
  const { pageData, previewData, requestUrl } = useLoaderData<{
    pageData: PageContent | null;
    previewData: Record<string, PreviewContent[]>;
    requestUrl: string;
  }>();
  const { colors, sanityDataset, sanityProjectId } = useOutletContext<{
    colors: Colors;
    sanityDataset: string;
    sanityProjectId: string;
  }>();

  const contextData: ContextData = {
    url: requestUrl,
    title: pageData?.title ?? "",
  };

  return pageData ? (
    <Content
      content={pageData.content}
      contextData={contextData}
      colors={colors}
      previewContent={previewData}
      sanityDataset={sanityDataset}
      sanityProjectId={sanityProjectId}
    />
  ) : null;
}
