// api/finish.js
import { db } from '../../lib/db'
export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end()
  const { session } = req.query
  if (!session) return res.status(400).end()
  const { data } = await db.from('sessions').select('userid,username').eq('session', session).single()
  if (!data) return res.status(404).end()
  await db.from('sessions').update({ valid: true, purchased_at: Date.now() }).eq('session', session)
  res.redirect(302, `${process.env.BASE_URL}/api/init?userid=${data.userid}&username=${encodeURIComponent(data.username)}`)
}
