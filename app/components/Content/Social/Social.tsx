import { type FC } from "react";
import { type SocialContent } from "~/types";
// import Icon from "components/Icon";

const Social: FC<Pick<SocialContent, "social">> = ({ social }) => (
  <section>
    <div className="max-w-7xl mx-auto relative bg-white overflow-hidden">
      <div className="relative px-8 bg-white lg:max-w-2xl lg:w-full ">
        <ul className="mx-3.5 flex flex-row flex-wrap justify-start md:mb-4 md:px-10 md:max-w-2xl lg:mb-5 list-none  relative bg-white overflow-hidden">
          {social.map((item) => (
            <li key={item._key}>
              <a
                className="py-2 px-4 sm:py-3 sm:px-6 flex flex-row m-2 rounded-full text-white hover:border-blue-700 border-2 bg-blue-500 hover:bg-blue-700 focus-visible:ring-rose-500"
                href={item.link}
              >
                {/* <Icon className="m-1" icon={item.title} /> */}
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Social;
