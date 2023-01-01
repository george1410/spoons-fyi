import { NextApiHandler } from 'next';
import { getPubs } from '../../../../lib/wetherspoonsApi';

const handler: NextApiHandler = async (req, res) => {
  const pubs = await getPubs();
};

export default handler;
