import graphql from "../graphql/index.js";
import type { PullRequest, Repository, User } from "../repo/index.js";

const pullRequestsQuery = `
query pullRequests($repo: String!, $after: String) {
  repository(owner: "medic", name: $repo) {
    pullRequests(states:OPEN, first:50, baseRefName: "master", after: $after) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      nodes{
        title
        url
        author {
          ... on User {
            login
            id
            name
          }
        }
      }
    }
  }
}
`;

export const fetchPullRequestsByUsers = async (
  repositoryName: string,
  users: User[],
): Promise<PullRequest[]> => {
  return fetchPullRequestsByUsersRecursively(repositoryName, users, [], null);
};

const fetchPullRequestsByUsersRecursively = async (
  repositoryName: string,
  users: User[],
  pullRequestsAccumulator: PullRequest[],
  after: string | null,
): Promise<PullRequest[]> => {
  const {
    repository: {
      pullRequests: { pageInfo, nodes: pullRequests },
    },
  } = (await graphql({
    query: pullRequestsQuery,
    repo: repositoryName,
    after: after,
  })) as any;

  for (const pr of pullRequests) {
    if (users.find((e) => e.id === pr.author.id)) {
      pullRequestsAccumulator.push(pr);
    }
  }

  if (pageInfo.hasNextPage) {
    await fetchPullRequestsByUsersRecursively(
      repositoryName,
      users,
      pullRequestsAccumulator,
      pageInfo.endCursor,
    );
  }

  return pullRequestsAccumulator;
};
