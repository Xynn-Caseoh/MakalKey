// api/init.js
const crypto = require('crypto');
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  const { userid, username } = req.query;
  if (!userid || !username) return res.status(400).end();
  const lookup = await fetch(`${process.env.UPSTASH_URL}/get/${userid}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_TOKEN}` }
  });
  const { result } = await lookup.json();
  if (!result) return res.status(403).end();
  const user = JSON.parse(result);
  if (!user.valid) return res.status(403).end();
  const now = Date.now();
  if (user.key && user.exp > now) {
    return res.status(200).json({ token: user.key });
  }
  const exp = now + 50 * 3600 * 1000;
  const payload = `${userid}:${username}:${exp}`;
  const sig = crypto.createHmac('sha256', process.env.HWID_SECRET).update(payload).digest('hex');
  const key = `${payload}:${sig}`;
  await fetch(`${process.env.UPSTASH_URL}/set/${userid}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.UPSTASH_TOKEN}` },
    body: JSON.stringify({ ...user, key, exp })
  });
  res.status(200).json({ token: key });
};
