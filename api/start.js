// api/start.js
const { v4: uuid } = require('uuid');
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const { userid, username } = req.query;
  if (!userid || !username) return res.status(400).end();
  const session = uuid();
  await fetch(`${process.env.UPSTASH_URL}/set/${session}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.UPSTASH_TOKEN}` },
    body: JSON.stringify({ userid, username, valid: false })
  });
  const link = `https://creators.lootlabs.gg/api/public/content_locker?api_token=${process.env.LOOTLABS_API_TOKEN}&title=Access&url=${encodeURIComponent(process.env.BASE_URL + '/api/finish?session=' + session)}&tier_id=1&number_of_tasks=3&theme=1`;// 0
  res.status(200).json({ session, link });
};
