import { type Repository } from "../repo/index.js";
import { Eta } from "eta";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const renderAsciiDocReport = (repositories: Repository[]): string => {
  const eta = new Eta({ views: path.join(process.cwd(), "templates") });

  return eta.render("./report.adoc.eta", { repositories: repositories });
};
