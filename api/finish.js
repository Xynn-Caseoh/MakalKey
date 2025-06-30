// api/finish.js
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  const { session } = req.query;
  if (req.method !== 'GET' || !session) return res.status(400).end();
  const lookup = await fetch(`${process.env.UPSTASH_URL}/get/${session}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_TOKEN}` }
  });
  const { result } = await lookup.json();
  if (!result) return res.status(404).end();
  const user = JSON.parse(result);
  await fetch(`${process.env.UPSTASH_URL}/set/${session}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.UPSTASH_TOKEN}` },
    body: JSON.stringify({ ...user, valid: true, purchasedAt: Date.now() })
  });
  res.redirect(302, `${process.env.BASE_URL}/api/init?userid=${user.userid}&username=${encodeURIComponent(user.username)}`);
};
