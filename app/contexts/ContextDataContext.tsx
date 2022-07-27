import { createContext, type FC, type ReactNode, useContext } from "react";
import type { ContextData } from "~/types";

const ContextDataContext = createContext<State | undefined>(undefined);

export const ContextDataContextProvider: FC<Props> = ({
  contextData,
  children,
}) => {
  return (
    <ContextDataContext.Provider
      value={{
        contextData,
      }}
    >
      {children}
    </ContextDataContext.Provider>
  );
};

export function useContextDataContext(): State {
  const context = useContext(ContextDataContext);
  if (context === undefined) {
    throw new Error(
      "useContextDataContext must be rendered in a tree within a ContextDataContextProvider"
    );
  }
  return context;
}

interface Props {
  contextData: ContextData;
  children: ReactNode;
}

interface State {
  contextData: ContextData;
}
