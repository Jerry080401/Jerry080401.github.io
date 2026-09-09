import { defineConfig } from "astro/config";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY || "").split("/");
const isPagesBuild = process.env.GITHUB_ACTIONS === "true" && owner && repository;
const isUserSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;

export default defineConfig({
  site: isPagesBuild
    ? `https://${owner.toLowerCase()}.github.io`
    : "https://jerry080401.github.io",
  base: isPagesBuild && !isUserSite ? `/${repository}` : "/",
  trailingSlash: "always"
});