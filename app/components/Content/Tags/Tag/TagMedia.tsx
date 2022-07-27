import { type FC } from "react";
import { type Tag } from "~/types";
import { Image } from "../../CommonContent";

const TagMedia: FC<Pick<Tag, "media" | "title">> = ({ media, title }) =>
  media ? (
    <Image
      className="h-3 w-3 mr-1"
      value={media}
      aria-hidden
      alt={title}
      width={12}
      height={12}
    />
  ) : (
    <div className="h-3" />
  );

export default TagMedia;
