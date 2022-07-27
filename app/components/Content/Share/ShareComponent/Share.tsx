import { type FC, useState } from "react";
import { type WithColors } from "~/types";
import ShareController from "./ShareController";
import SharePopup from "./SharePopup";

const Share: FC<WithColors<Props>> = ({
  className,
  shareData,
  children,
  onInteraction,
  onSuccess,
  onError,
  disabled,
  colors,
}) => {
  const [openPopup, setOpenPopup] = useState(false);

  const handleNonNativeShare = () => {
    setOpenPopup(true);
  };

  return (
    <>
      <ShareController
        className={className}
        shareData={shareData}
        onInteraction={onInteraction}
        onSuccess={onSuccess}
        onError={onError}
        onNonNativeShare={handleNonNativeShare}
        disabled={disabled}
      >
        {children}
      </ShareController>
      {openPopup ? (
        <SharePopup
          shareData={shareData}
          colors={colors}
          onClose={() => setOpenPopup(false)}
        />
      ) : null}
    </>
  );
};

interface Props {
  className: string;
  shareData: ShareData;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default Share;
