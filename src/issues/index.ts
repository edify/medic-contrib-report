import graphql from "../graphql/index.js";
import type { Issue, User } from "../repo/index.js";

const issuesQuery = `
query issues($repo: String!, $after: String, $user: String!) {
  repository(owner: "medic", name: $repo) {
    issues(states:OPEN, first:50, after: $after, filterBy: {assignee: $user}) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes{
        title
        url
      }
    }
  }
}
`;

export const fetchIssuesByUsers = async (
  repositoryName: string,
  users: User[],
): Promise<Issue[]> => {
  return fetchIssuesByUsersRecursively(repositoryName, users, [], null);
};

const fetchIssuesByUsersRecursively = async (
  repositoryName: string,
  users: User[],
  issuesAccumulator: Issue[],
  after: string | null,
): Promise<Issue[]> => {
  for (const user of users) {
    const {
      repository: {
        issues: { pageInfo, nodes: issues },
      },
    } = (await graphql({
      query: issuesQuery,
      repo: repositoryName,
      after: after,
      user: user.login,
    })) as any;

    for (const issue of issues) {
      issue.assignee = user;
      issuesAccumulator.push(issue);
    }

    if (pageInfo.hasNextPage) {
      await fetchIssuesByUsersRecursively(
        repositoryName,
        users,
        issuesAccumulator,
        pageInfo.endCursor,
      );
    }
  }

  return issuesAccumulator;
};
