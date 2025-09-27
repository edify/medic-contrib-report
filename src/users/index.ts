import graphql from "../graphql/index.js";
import type { User } from "../repo/index.js";

export const fetchUsers = async (): Promise<User[]> => {
  const { organization } = await graphql(`
  {
    organization(login: "edify") {
      team(slug: "medic") {
        members {
          nodes {
            id
            login
            name
          }
        }
      }
    }
  }
`) as any;

  const {
    team: {
      members: { nodes: edifyMedicTeamMembers },
    },
  } = organization;

  const users = [];

  for (const user of edifyMedicTeamMembers) {
    users.push(user);
  }

  return users
}

