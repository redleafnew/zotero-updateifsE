import { defineConfig } from "zotero-plugin-scaffold";
import pkg from "./package.json";
import { copyFileSync } from "node:fs";

export default defineConfig({
  source: ["src", "addon"],
  dist: "build",
  name: pkg.config.addonName,
  id: pkg.config.addonID,
  namespace: pkg.config.addonRef,
  updateURL: `https://github.com/{{owner}}/{{repo}}/releases/download/release/${
    pkg.version.includes("-") ? "update-beta.json" : "update.json"
  }`,
  xpiDownloadLink:
    "https://github.com/{{owner}}/{{repo}}/releases/download/v{{version}}/{{xpiName}}.xpi",

  build: {
    assets: ["addon/**/*.*"],
    define: {
      ...pkg.config,
      author: pkg.author,
      description: pkg.description,
      homepage: pkg.homepage,
      buildVersion: pkg.version,
      buildTime: "{{buildTime}}",
    },
    esbuildOptions: [
      {
        entryPoints: ["src/index.ts"],
        define: {
          __env__: `"${process.env.NODE_ENV}"`,
        },
        bundle: true,
        target: "firefox115",
        outfile: `build/addon/chrome/content/scripts/${pkg.config.addonRef}.js`,
      },
    ],
    makeUpdateJson: {
      updates: [
        {
          version: "0.13.0",
          update_link:
            "https://github.com/redleafnew/zotero-updateifsE/releases/download/0.13.0/greenfrog.xpi",
          applications: {
            gecko: {
              strict_min_version: "60.0",
            },
          },
        },
      ],
    },
  },

  // If you need to see a more detailed log, uncomment the following line:
  // logLevel: "trace",
});
