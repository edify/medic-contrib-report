import graphql from "../graphql/index.js";
import type { CommitsPerUser, User } from "../repo/index.js";

const commitsByUserQuery = `
query userContributions($userId: ID!, $repo: String!) {
  repository(owner: "medic", name: $repo) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(author: {id: $userId}) {
            totalCount
          }
        }
      }
    }
  }
}
`;

export const fetchCommitsPerUsers = async (
  repositoryName: string,
  users: User[],
): Promise<CommitsPerUser[]> => {
  return Promise.all(
    users.map(async (user) => {
      const {
        repository: {
          defaultBranchRef: {
            target: {
              history: { totalCount: totalCommitsCount },
            },
          },
        },
      } = (await graphql({
        query: commitsByUserQuery,
        userId: user.id,
        repo: repositoryName,
      })) as any;

      return { author: user, totalCommitsCount };
    }),
  );
};
