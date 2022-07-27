import { type CTA } from "~/types";
import { type FC } from "react";

const Ctas: FC<Props> = ({ ctas }) => (
  <>
    {ctas &&
      ctas.map((cta) =>
        cta?.type === "secondary" ? (
          <div key={cta.title} className="mt-3 sm:mt-0 sm:ml-3">
            <a
              href={cta.link}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
            >
              {cta.title}
            </a>
          </div>
        ) : (
          <div key={cta.title} className="rounded-md shadow">
            <a
              href={cta.link}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              {cta.title}
            </a>
          </div>
        )
      )}
  </>
);

interface Props {
  ctas: CTA[];
}

export default Ctas;
