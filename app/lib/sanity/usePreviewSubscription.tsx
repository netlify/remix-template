import { type Subscription, type GroqStore } from "@sanity/groq-store";
import { useEffect, useState } from "react";

export function usePreviewSubscription<T>(
  query: string,
  sanityProjectId: string,
  sanityDataset: string,
  subscriptionOptions: { params: Record<string, unknown>; initialData: T }
) {
  const { params, initialData } = subscriptionOptions;
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    let sub: Subscription;
    let store: GroqStore | undefined;

    async function createStore() {
      // For more details about configuring groq-store see:
      // https://www.npmjs.com/package/@sanity/groq-store
      const {
        default: { groqStore },
      } = await import("@sanity/groq-store");

      // const { dataset } = config;

      store = groqStore({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        listen: true,
        overlayDrafts: true,
        documentLimit: 1000,
      });

      sub = store.subscribe(
        query,
        params ?? {}, // Params
        (err, result) => {
          if (err) {
            return;
          }
          setData(result);
        }
      );
    }

    if (!store) {
      createStore();
    }

    return () => {
      if (sub) sub.unsubscribe();
      if (store) store.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data };
}
