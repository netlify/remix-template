import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type Tag as TagType } from "~/types";
import TagMedia from "./TagMedia";

const Tag: FC<TagType> = ({ title, link, route, media }) => {
  if (link) {
    return (
      <a
        className="h-8 ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border hover:border-blue-700 hover:bg-blue-700 hover:text-white  focus-visible:ring-blue-500"
        href={link}
      >
        <TagMedia media={media} title={title} />
        {title}
      </a>
    );
  }

  if (route) {
    return (
      <Link
        className="h-8 ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border hover:border-blue-700 hover:bg-blue-700 hover:text-white focus-visible:ring-blue-500"
        to={route.slug.current}
      >
        <TagMedia media={media} title={title} />
        {title}
      </Link>
    );
  }
  return (
    <div className="h-8 ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border">
      <TagMedia media={media} title={title} />
      {title}
    </div>
  );
};

export default Tag;
