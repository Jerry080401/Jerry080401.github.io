import { defineConfig } from "astro/config";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY || "").split("/");
const isPagesBuild = process.env.GITHUB_ACTIONS === "true" && owner && repository;
const isUserSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const primarySite = "https://jerry0804.dev";

export default defineConfig({
  site: isPagesBuild && !isUserSite
    ? `https://${owner.toLowerCase()}.github.io`
    : primarySite,
  base: isPagesBuild && !isUserSite ? `/${repository}` : "/",
  trailingSlash: "always"
});
