export interface Repository {
  name: string;
  pullRequests: PullRequest[];
  issues: Issue[];
  commitsPerUser: CommitsPerUser[];
  readonly totalCommits: number;
  readonly totalOpenIssues: number;
  readonly totalOpenPullRequests: number;
}

export interface PullRequest {
  title: string;
  url: string;
  author: User;
}

export interface Issue {
  title: string;
  url: string;
  assignee: User;
}

export interface User {
  login: string;
  id: string;
  name: string;
}

export interface CommitsPerUser {
  author: User;
  totalCommitsCount: number;
}

export class RepositoryImpl implements Repository {
  name: string;
  pullRequests: PullRequest[];
  issues: Issue[];
  commitsPerUser: CommitsPerUser[];

  constructor(
    name: string,
    pullRequests: PullRequest[],
    issues: Issue[],
    commitsPerUser: CommitsPerUser[],
  ) {
    this.name = name;
    this.pullRequests = pullRequests;
    this.issues = issues;
    this.commitsPerUser = commitsPerUser;
  }

  get totalCommits(): number {
    return this.commitsPerUser.reduce(
      (acc, currentValue) => acc + currentValue.totalCommitsCount,
      0,
    );
  }

  get totalOpenIssues(): number {
    return this.issues.length;
  }

  get totalOpenPullRequests(): number {
    return this.pullRequests.length;
  }
}
