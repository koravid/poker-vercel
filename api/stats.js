const SUPABASE_URL = 'https://xgdkbtpsaljxggfmbakq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZGtidHBzYWxqeGdnZm1iYWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODM1OTgsImV4cCI6MjA4OTI1OTU5OH0.YR-55Q1lxKFnJUBnBFUglJEDZ2E3LwgTnQgZXds0YTY';
const H = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY };
const SITES = ['wina','ps','pmu','bet','uni'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const r = await fetch(SUPABASE_URL + '/rest/v1/current_session?id=eq.1', { headers: H });
  const rows = await r.json();
  const data = rows?.[0]?.data || {};
  const stat = req.query.stat || 'buyin';
  const site = req.query.site || null;

  let buyins = 0, mtt = 0;
  if (site) {
    buyins = data.buyins?.[site] || 0;
    mtt = data.mtt?.[site] || 0;
  } else {
    SITES.forEach(s => { buyins += data.buyins?.[s] || 0; mtt += data.mtt?.[s] || 0; });
  }
  const abi = mtt > 0 ? (buyins / mtt).toFixed(2) : '0.00';

  let text = '';
  if (stat === 'buyin') text = `€${buyins.toFixed(2)}`;
  else if (stat === 'mtt') text = `${mtt} MTT`;
  else if (stat === 'abi') text = `ABI €${abi}`;
  else if (stat === 'all') text = `€${buyins.toFixed(2)}\n${mtt} MTT\nABI €${abi}`;

  res.status(200).json({
  buyin: `${buyins.toFixed(2)}€`,
  mtt: `${mtt}`,
  abi: `${abi}€`,
  all: `€${buyins.toFixed(2)} | ${mtt} MTT | ABI €${abi}`
});
}
