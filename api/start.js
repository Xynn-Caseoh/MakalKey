// api/start.js
import { v4 as uuid } from 'uuid'
import { db } from '../../lib/db'
export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end()
  const { userid, username } = req.query
  if (!userid || !username) return res.status(400).end()
  const session = uuid()
  await db.from('sessions').upsert({ session, userid, username, valid: false })
  const link = `https://creators.lootlabs.gg/api/public/content_locker?api_token=${process.env.LOOTLABS_API_TOKEN}&title=Access&url=${encodeURIComponent(process.env.BASE_URL+'/api/finish?session='+session)}&tier_id=1&number_of_tasks=3&theme=1`
  res.status(200).json({ session, link })
}
