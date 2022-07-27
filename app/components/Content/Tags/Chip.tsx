import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type Tag } from "~/types";
import { Image } from "../CommonContent";

const Chip: FC<Tag> = ({ title, link, route, media }) => {
  if (link) {
    return (
      <a
        className="py-2 px-4 sm:py-3 sm:px-6 flex flex-row m-2 rounded-full text-white hover:border-blue-700 border-2 bg-blue-500 hover:bg-blue-700 focus-visible:ring-blue-500"
        href={link}
      >
        {media ? (
          <Image
            className="h-6 w-6 mr-1"
            value={media}
            aria-hidden
            alt={title}
            width={24}
            height={24}
          />
        ) : null}
        {title}
      </a>
    );
  }

  if (route) {
    return (
      <Link
        className="py-2 px-4 sm:py-3 sm:px-6 flex flex-row m-2 rounded-full text-white hover:border-blue-700 border-2 bg-blue-500 hover:bg-blue-700 focus-visible:ring-blue-500"
        to={route.slug.current}
      >
        {media ? (
          <Image
            className="h-6 w-6 mr-1"
            value={media}
            aria-hidden
            alt={title}
            width={24}
            height={24}
          />
        ) : null}
        {title}
      </Link>
    );
  }
  return (
    <div className="py-2 px-4 sm:py-3 sm:px-6 flex flex-row m-2 rounded-full text-white  border-2 bg-blue-500  focus-visible:ring-blue-500">
      {media ? (
        <Image
          className="h-6 w-6 mr-1"
          value={media}
          aria-hidden
          alt={title}
          width={24}
          height={24}
        />
      ) : null}
      {title}
    </div>
  );
};

export default Chip;
