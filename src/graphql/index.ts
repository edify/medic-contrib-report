import { graphql } from "@octokit/graphql";

export default graphql.defaults({
  headers: {
    authorization: `token ${process.env.GH_TOKEN}`,
  },
});

