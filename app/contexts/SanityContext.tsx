import { createContext, type FC, type ReactNode, useContext } from "react";

const SanityContext = createContext<SanityConfigState | undefined>(undefined);

export const SanityContextProvider: FC<Props> = ({
  sanityDataset,
  sanityProjectId,
  children,
}) => {
  return (
    <SanityContext.Provider
      value={{
        sanityDataset,
        sanityProjectId,
      }}
    >
      {children}
    </SanityContext.Provider>
  );
};

export function useSanityContext(): SanityConfigState {
  const context = useContext(SanityContext);
  if (context === undefined) {
    throw new Error(
      "useSanityContext must be rendered in a tree within a SanityContextProvider"
    );
  }
  return context;
}

interface Props {
  sanityDataset: string;
  sanityProjectId: string;
  children: ReactNode;
}

interface SanityConfigState {
  sanityDataset: string;
  sanityProjectId: string;
}
