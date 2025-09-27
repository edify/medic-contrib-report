import { fetchCommitsPerUsers } from "./commits/index.js";
import { fetchIssuesByUsers } from "./issues/index.js";
import { fetchPullRequestsByUsers } from "./pull_request/index.js";
import { RepositoryImpl } from "./repo/index.js";
import { renderAsciiDocReport } from "./reports/index.js";
import { fetchUsers } from "./users/index.js";

const edifyUsers = await fetchUsers();

const repositoriesInfo = await Promise.all(
  ["cht-core", "cht-docs"].map(async (repositoryName: string) => {
    return new RepositoryImpl(
      repositoryName,
      await fetchPullRequestsByUsers(repositoryName, edifyUsers),
      await fetchIssuesByUsers(repositoryName, edifyUsers),
      await fetchCommitsPerUsers(repositoryName, edifyUsers),
    );
  }),
);

console.log(renderAsciiDocReport(repositoriesInfo));
