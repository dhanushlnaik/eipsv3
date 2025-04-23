import { Request, Response } from 'express';
import fetch from 'node-fetch'; // Ensure you're using the latest fetch for Node.js
const githubToken: string | undefined = process.env.ACCESS_TOKEN;

if (!githubToken) {
  throw new Error(
    'GitHub access token (ACCESS_TOKEN) is not defined in the environment variables'
  );
}

const repoOwner = 'ethereum';
const repoName = 'EIPs';

// Function to fetch contributors recursively and handle pagination
interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  [key: string]: string | number | undefined;
}

async function fetchContributors(
  url: string,
  headers: Record<string, string>,
  allContributors: Contributor[] = []
): Promise<Contributor[]> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch contributors. Status code: ${response.status}`
    );
  }

  const contributors: Contributor[] = (await response.json()) as Contributor[];
  allContributors = allContributors.concat(contributors);

  // Check if there are more pages of contributors
  const nextPageLink = response.headers.get('link');
  if (nextPageLink && nextPageLink.includes('rel="next"')) {
    const match = nextPageLink.match(/<([^>]+)>;\s*rel="next"/);
    if (match && match[1]) {
      const nextPageUrl = match[1];
      return fetchContributors(nextPageUrl, headers, allContributors);
    }
  }

  return allContributors;
}

// Construct the URL for the GitHub API endpoint
const contributorsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;

// Set up headers for authentication
const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `token ${githubToken}`,
};

// Function to handle the request
const handleRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const allContributors = await fetchContributors(contributorsUrl, headers);

    if (allContributors) {
      res.json(allContributors);
    } else {
      res.status(500).send('Internal server error');
    }
  } catch (error) {
    console.error('Error fetching contributors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the function as the default module
export default handleRequest;
