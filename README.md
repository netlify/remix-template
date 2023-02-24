# Netlify Remix Template

Welcome to the Netlify Remix Template project.

To use the template, run

```bash
npx create-remix --template netlify/remix-template
```

This project includes:

- Netlify Functions template for Remix sites
- Netlify Edge Functions template for Remix sites

## Development

There is no need to run `npm install` as this is a template. The Remix CLI will install the dependencies for you. Make changes to files as you see fit. If there are transformations for files for either the Netlify Functions or Netlify Edge Functions template, make the appropriate changes to the `remix.init/index.js` file.

If you're new to Remix stacks and the remix.init concept, see the official [Remix Stacks](https://remix.run/stacks) documentation.

### Testing your changes

Run

```bash
npx create-remix --template ./
```

to test your changes to the template. Follow the steps the Remix CLI prompts you with to create a new project. Ensure to test for both the Netlify Functions template and the Netlify Edge Functions template.
