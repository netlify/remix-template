import { type FC } from "react";
import { type PortableTextBlock } from "@portabletext/types";
import { Link } from "@remix-run/react";

import { BlockContent } from "../Common";
import { type NavItem } from "~/types";

const Footer: FC<Props> = ({ siteTitle, navigation, footerText, social }) => {
  return (
    <footer className="text-center lg:text-left bg-gray-100 text-gray-600">
      {social.length > 0 ? (
        <div className="flex justify-center items-center lg:justify-between p-6 border-b border-gray-300">
          <div className="mr-12 hidden lg:block">
            <span>Get connected with us on social networks:</span>
          </div>
          <div className="flex justify-center">
            {social.map((si) => (
              <a
                key={si.title.name}
                href={si.link}
                aria-label={si.title.name}
                className="mr-6 text-gray-600"
              >
                <svg className="w-9 h-9">
                  <symbol
                    id={si._key}
                    dangerouslySetInnerHTML={{ __html: si.title.svg }}
                  />
                  <use href={`#${si._key}`} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="">
            <h6
              className="
            uppercase
            font-semibold
            mb-4
            flex
            items-center
            justify-center
            md:justify-start
          "
            >
              {siteTitle}
            </h6>
            <BlockContent text={footerText} />
          </div>
          <div className=""></div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Useful links
            </h6>

            {navigation.map((item) => (
              <p key={item.name} className="mb-4">
                <Link className="mb-4" key={item.name} to={item.to}>
                  {item.name}
                </Link>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center p-6 bg-gray-200">
        <span>© {new Date().getFullYear()} Copyright </span>
      </div>
    </footer>
  );
};

interface Props {
  siteTitle: string;
  navigation: NavItem[];
  footerText: PortableTextBlock[];
  social: {
    _key: string;
    title: { name: string; svg: string };
    link: string;
  }[];
}

export default Footer;
