export const config = {
  apiVersion: "2021-03-25",
  // Find these in your ./studio/sanity.json file
  dataset: process.env.SANITY_DATASET ?? "production",
  projectId: process.env.SANITY_PROJECT_ID ?? ``,
  useCdn: false,
};
