const SUPABASE_URL = 'https://xgdkbtpsaljxggfmbakq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZGtidHBzYWxqeGdnZm1iYWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODM1OTgsImV4cCI6MjA4OTI1OTU5OH0.YR-55Q1lxKFnJUBnBFUglJEDZ2E3LwgTnQgZXds0YTY';
const H = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY };
const SITES = ['wina','ps','pmu','bet','uni'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const empty = { buyins: {}, mtt: {} };
  SITES.forEach(id => { empty.buyins[id] = 0; empty.mtt[id] = 0; });
  await fetch(SUPABASE_URL + '/rest/v1/current_session?id=eq.1', {
    method: 'PATCH', headers: H, body: JSON.stringify({ data: empty })
  });
  return res.status(200).json({ ok: true });
}
