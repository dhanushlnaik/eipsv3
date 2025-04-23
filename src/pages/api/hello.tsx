import { Request, Response } from 'express';

const render = async (req: Request, res: Response) => {
  res.status(200).json({
    oka: req.url,
  });
};

export default render;
