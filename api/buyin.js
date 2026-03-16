const SUPABASE_URL = 'https://xgdkbtpsaljxggfmbakq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZGtidHBzYWxqeGdnZm1iYWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODM1OTgsImV4cCI6MjA4OTI1OTU5OH0.YR-55Q1lxKFnJUBnBFUglJEDZ2E3LwgTnQgZXds0YTY';
const H = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=representation' };
const SITES = ['wina','ps','pmu','bet','uni'];

async function sb(path, method='GET', body=null) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, { method, headers: H, body: body ? JSON.stringify(body) : null });
  const txt = await r.text();
  return txt ? JSON.parse(txt) : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url, `https://${req.headers.host}`);
  const site = url.searchParams.get('site') || req.body?.site;
  const amount = parseFloat(url.searchParams.get('amount') || req.body?.amount);

  if (!SITES.includes(site) || isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: 'Paramètres invalides: site=' + site + ' amount=' + amount });

  const rows = await sb('current_session?id=eq.1');
  const data = rows?.[0]?.data || {};
  if (!data.buyins) data.buyins = {};
  if (!data.mtt) data.mtt = {};
  SITES.forEach(id => { if (!data.buyins[id]) data.buyins[id] = 0; if (!data.mtt[id]) data.mtt[id] = 0; });
  data.buyins[site] = (data.buyins[site] || 0) + amount;
  data.mtt[site] = (data.mtt[site] || 0) + 1;
  await sb('current_session?id=eq.1', 'PATCH', { data });
  return res.status(200).json({ ok: true, session: data });
}
