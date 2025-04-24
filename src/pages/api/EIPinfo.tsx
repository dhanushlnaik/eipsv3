import { Request, Response } from 'express';
import axios from 'axios';

const render = async (req: Request, res: Response) => {
  try {
    const repositoryUrl = 'https://api.github.com/repos/ethereum/EIPs';

    const response = await axios.get(repositoryUrl, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`,
        'User-Agent': 'EIPs-Insights-App',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log(response.data);

    const forksCount = response.data.forks_count;
    const watchlistCount = response.data.subscribers_count;
    const stars = response.data.stargazers_count;
    const openIssuesCount = response.data.open_issues_count;

    res.json({
      forksCount,
      watchlistCount,
      stars,
      openIssuesCount,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error(err.response.data);
      res
        .status(500)
        .json({ message: 'Server Error', error: err.response.data });
    } else if (err instanceof Error) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    } else {
      console.error('Unknown error occurred');
      res.status(500).json({ message: 'Server Error', error: 'Unknown error' });
    }
  }
};

export default render;
