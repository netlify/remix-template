import { type PortableTextBlock } from "@portabletext/types";
import { type SanityImageAsset } from "@sanity/asset-utils";

export type ContentTypes =
  | "hero"
  | "cards"
  | "banner"
  | "textSection"
  | "imageSection"
  | "contentPreview"
  | "route"
  | "tags"
  | "shareSection";

export interface BaseEntity {
  _id: string;
}

export interface BaseContent extends BaseEntity {
  _key: string;
  _type: ContentTypes;
}

export interface HeroContent extends BaseContent {
  _type: "hero";
  ctas: CTA[];
  heading: string;
  subHeading: string;
  label: string;
  tagline: PortableTextBlock[];
  image: {
    alt: string;
    asset: {
      url: string;
      creditLine: string;
      description: string;
    };
  };
}

export interface CardsContent extends BaseContent {
  _type: "cards";
  cards: CardType[];
}

export interface ShareContent extends BaseContent {
  _type: "shareSection";
  shareData: ShareData;
}

export interface BannerContent extends BaseContent {
  _type: "banner";
  ctas: CTA[];
  heading: string;
  subHeading: string;
}

export interface TagsContent extends BaseContent {
  _type: "tags";
  tags: Tag[];
  as?: "tags" | "chips";
  ariaLabel: string;
  title?: string;
}

export interface Tag {
  _key: string;
  title: string;
  description?: PortableTextBlock[];
  link?: string;
  route?: { slug: Slug };
  media?: SanityImageAsset;
}

export interface TextSectionContent extends BaseContent {
  _type: "textSection";
  heading: string;
  text: PortableTextBlock[];
}

export interface ContentPreview extends BaseContent {
  _type: "contentPreview";
  heading: string;
  query: Query;
  params: KeyValue[];
  parentRoute: RouteReference;
  data: Record<string, PreviewContent[]>;
}

export interface RouteReference extends BaseContent {
  _type: "route";
  slug: Slug;
}

export interface ImageSectionContent extends BaseContent {
  _type: "imageSection";
  label: string;
  heading: string;
  text: PortableTextBlock[];
  image: { alt?: string; asset: SanityImageAsset; caption?: string };
  cta?: CTA;
}

export interface PreviewContent {
  _id: string;
  title: string;
  slug: Slug;
  description?: PortableTextBlock[];
  openGraphImage?: SanityImageAsset;
  previewTags?: { tags: Tag[] }[];
}

export type Content =
  | HeroContent
  | CardsContent
  | BannerContent
  | TagsContent
  | TextSectionContent
  | ImageSectionContent
  | ContentPreview
  | RouteReference
  | ShareContent;

export type Slug = {
  _type: "slug";
  current: string;
};

export type CTA = {
  title: string;
  link?: string;
  route?: { slug: Slug };
  type?: "primary" | "secondary";
};

export type CardType = {
  _key: string;
  title: string;
  text: PortableTextBlock[];
  cta: CTA;
  enabled: boolean;
  fromColor?: string;
  toColor?: string;
};

type Color = {
  hex: string;
};

export interface Colors {
  primary: Color;
  primaryText: Color;
  primaryLight: Color;
  primaryLightText: Color;
  primaryDark: Color;
  primaryDarkText: Color;
  secondary: Color;
  secondaryText: Color;
  secondaryLight: Color;
  secondaryLightText: Color;
  secondaryDark: Color;
  secondaryDarkText: Color;
  background: Color;
}

export type WithColors<T> = T & { colors: Colors };

export interface RawNavItem {
  _id: string;
  page: { title: string };
  slug: { current: string };
}
export interface NavItem {
  id: string;
  name: string;
  to: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface PageData {
  page: PageContent;
  slug: Slug;
}

export interface PageContent {
  title: string;
  content: Content[];
}

export interface LoadableContent {
  root: string;
  query: Query;
  params: KeyValue[];
}

export interface Query {
  queryCode: { code: string };
  queryParams: { key: string; optional: boolean };
}

export interface ContextData {
  url: string;
  title: string;
}
