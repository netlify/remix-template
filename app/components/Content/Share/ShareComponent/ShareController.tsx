import { type FC } from "react";

const Share: FC<Props> = ({
  className,
  shareData,
  children,
  onInteraction,
  onSuccess,
  onError,
  onNonNativeShare,
  disabled,
}) => {
  const handleOnClick = async () => {
    onInteraction && onInteraction();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onSuccess && onSuccess();
      } catch (err) {
        onError && onError(err);
      }
    } else {
      onNonNativeShare && onNonNativeShare();
    }
  };
  return (
    <button
      className={className}
      onClick={handleOnClick}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface Props {
  className: string;
  shareData: ShareData;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onNonNativeShare?: () => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default Share;
