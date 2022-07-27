import { type FC, useState, useEffect, useRef } from "react";
import { type WithColors } from "~/types";

const SharePopup: FC<WithColors<Props>> = ({
  shareData,
  onClose,
  onError,
  colors,
}) => {
  const [state, setState] = useState<ShareState>("pending");
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === "success") {
      timer.current = setInterval(() => setState("pending"), 3000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [state]);

  const copyClicked = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.url || "");
      setState("success");
    } catch (err) {
      onError && onError(err);
      setState("error");
    }
  };

  const getButtonText = (state: ShareState) => {
    switch (state) {
      case "success":
        return "Link copied";
      case "pending":
      default:
        return "Copy link";
    }
  };

  return (
    <div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed z-20 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="m-2 inline-flex text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 mb-2 font-medium text-gray-900 prose">
                  {shareData.title}
                </h3>
                <button className="ml-4" onClick={onClose}>
                  <span className="sr-only">Close menu</span>
                  <div className="h-6 w-6" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g id="close">
                        <path
                          id="x"
                          d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="m-2">
                {state === "error" ? (
                  <div className="mb-2 p-2 border-2 rounded-md border-red-600">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="m-2">
                      <p className="text-sm text-red-500 text-center prose">
                        Unable to copy to clipboard, please manually copy the
                        url to share.
                      </p>
                    </div>
                  </div>
                ) : null}
                <input
                  className="w-full mb-4 p-2 overflow-hidden border-2 rounded-md border-gray-500 prose"
                  value={shareData.url}
                  readOnly
                />
                <button
                  style={{
                    backgroundColor: colors.primary.hex,
                    color: colors.primaryText.hex,
                  }}
                  className="w-full mx-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={copyClicked}
                >
                  {getButtonText(state)}
                  {state === "success" ? (
                    <svg
                      aria-hidden="true"
                      height="20"
                      viewBox="0 0 16 16"
                      width="20"
                    >
                      <path
                        fillRule="evenodd"
                        fill="currentColor"
                        stroke="currentColor"
                        d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                      ></path>
                    </svg>
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ShareState = "pending" | "success" | "error";

interface Props {
  shareData: ShareData;
  onClose: () => void;
  onError?: (error?: unknown) => void;
}

export default SharePopup;
