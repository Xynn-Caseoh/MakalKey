// api/init.js
import crypto from 'crypto'
import { db } from '../../lib/db'
export default async (req, res) => {
  const { userid, username } = req.query
  if (!userid || !username) return res.status(400).end()
  const { data: user } = await db.from('sessions').select('valid,key,exp').eq('userid', userid).single()
  if (!user || !user.valid) return res.status(403).end()
  const now = Date.now()
  if (user.key && user.exp > now) return res.status(200).json({ token: user.key })
  const exp = now + 50 * 3600 * 1000
  const payload = `${userid}:${username}:${exp}`
  const sig = crypto.createHmac('sha256', process.env.HWID_SECRET).update(payload).digest('hex')
  const key = `${payload}:${sig}`
  await db.from('sessions').upsert({ userid, key, exp })
  res.status(200).json({ token: key })
}
