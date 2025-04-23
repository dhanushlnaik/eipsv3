import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

const getGitHubInsightsForMonth = async (
  owner: string,
  repo: string,
  year: number,
  month: number
) => {
  const octokit = new Octokit({ auth: process.env.ACCESS_TOKEN });

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startISODate = startDate.toISOString();
    const endISODate = endDate.toISOString();

    let mergedPRsThisMonth: RestEndpointMethodTypes['pulls']['list']['response']['data'] =
      [];

    // Fetch merged PRs within the date range
    let page = 1;
    while (true) {
      const { data: mergedPRs } = await octokit.pulls.list({
        owner,
        repo,
        state: 'closed',
        sort: 'created',
        direction: 'desc',
        per_page: 100,
        page,
      });

      const prsInDateRange = mergedPRs.filter(
        (pr) =>
          pr.merged_at &&
          new Date(pr.merged_at) >= startDate &&
          new Date(pr.merged_at) <= endDate
      );

      mergedPRsThisMonth = mergedPRsThisMonth.concat(prsInDateRange);

      if (prsInDateRange.length < 100) break;

      page++;
    }

    // Fetch open PRs within the date range
    const { data: openPRs } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 100,
    });

    const openPRsThisMonth = openPRs.filter(
      (pr) =>
        new Date(pr.created_at) >= startDate &&
        new Date(pr.created_at) <= endDate
    );

    // Fetch closed issues within the date range
    const { data: closedIssues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'closed',
      sort: 'created',
      direction: 'desc',
      per_page: 100,
    });

    const closedIssuesThisMonth = closedIssues.filter(
      (issue) =>
        issue.closed_at &&
        new Date(issue.closed_at) >= startDate &&
        new Date(issue.closed_at) <= endDate
    );

    // Fetch new issues within the date range
    const { data: newIssues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      sort: 'created',
      direction: 'asc',
      per_page: 100,
    });

    const newIssuesThisMonth = newIssues.filter(
      (issue) =>
        new Date(issue.created_at) >= startDate &&
        new Date(issue.created_at) <= endDate
    );

    // Fetch commits to the master branch
    const { data: commitsToMaster } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: 'master',
      since: startISODate,
      until: endISODate,
      per_page: 100,
    });

    // Fetch commits to all branches
    const { data: commitsToAllBranches } = await octokit.repos.listCommits({
      owner,
      repo,
      since: startISODate,
      until: endISODate,
      per_page: 100,
    });

    // Fetch contributors
    const { data: contributors } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    });

    // Calculate files changed, insertions, and deletions
    let filesChanged = 0;
    let insertions = 0;
    let deletions = 0;

    for (const commit of commitsToAllBranches) {
      const { data: commitDetails } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: commit.sha,
      });

      if (commitDetails.files && commitDetails.stats) {
        filesChanged += commitDetails.files.length;
        insertions += commitDetails.stats?.additions ?? 0;
        deletions += commitDetails.stats?.deletions ?? 0;
      }
    }

    return {
      mergedPRs: mergedPRsThisMonth.length,
      openPRs: openPRsThisMonth.length,
      closedIssues: closedIssuesThisMonth.length,
      newIssues: newIssuesThisMonth.length,
      commitsToMaster: commitsToMaster.length,
      commitsToAllBranches: commitsToAllBranches.length,
      contributors: contributors.length,
      filesChanged,
      insertions,
      deletions,
    };
  } catch (error) {
    console.error('Error fetching GitHub insights:', error);
    throw new Error('Failed to retrieve GitHub insights');
  }
};

const handler = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const year = parseInt(parts[3], 10);
  const month = parseInt(parts[4], 10);

  if (isNaN(year) || isNaN(month)) {
    res.status(400).json({ error: 'Invalid year or month provided' });
    return;
  }

  try {
    const owner = 'ethereum';
    const repo = 'EIPs';

    const insights = await getGitHubInsightsForMonth(owner, repo, year, month);
    res.json(insights);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
