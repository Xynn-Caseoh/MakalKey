// api/finish.js
import { getDb } from '../../lib/db'
export default async (req,res)=>{
  if(req.method!=='GET')return res.status(405).end()
  const{session}=req.query
  if(!session)return res.status(400).end()
  const db=await getDb()
  const doc=await db.collection('sessions').findOne({session})
  if(!doc)return res.status(404).end()
  await db.collection('sessions').updateOne({session},{$set:{valid:true,purchasedAt:Date.now()}})
  res.redirect(302,`${process.env.BASE_URL}/api/init?userid=${doc.userid}&username=${encodeURIComponent(doc.username)}`)
}
