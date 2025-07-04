// api/script/[name].js
import fetch from 'node-fetch'
import crypto from 'crypto'
import { buffer } from 'micro'
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  const raw = await buffer(req)
  const { name, token } = JSON.parse(raw.toString())
  if (!name || !token) return res.status(400).end()
  const [uid, usr, exp, sig] = token.split(':')
  if (!uid||!usr||!exp||!sig||Date.now()>+exp) return res.status(403).end()
  if (crypto.createHmac('sha256',process.env.HWID_SECRET).update(`${uid}:${usr}:${exp}`).digest('hex')!==sig) return res.status(403).end()
  const r = await fetch(`${process.env.BASE_URL}/scripts/${name}.lua`)
  if (!r.ok) return res.status(404).end()
  const script = await r.text()
  res.setHeader('Content-Type','text/plain')
  res.send(script)
}
export const config = { api: { bodyParser: false } }
