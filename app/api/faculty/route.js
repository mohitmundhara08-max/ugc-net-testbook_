// app/api/faculty/route.js
// GET  → list all faculty + their assigned channels + unassigned channel list
// POST → assign or unassign a channel to a faculty
//        body: { chat_username, faculty_email?, subject? }
//        - faculty_email omitted or null → unassign
//        - faculty_email present → assign (upsert)

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = (SB_URL && SB_KEY)
  ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

// All canonical channels we operate (mirrors the SUBJECTS map in components).
// Used to surface UNASSIGNED channels in the UI. Source of truth for "what channels exist".
const ALL_CHANNELS = [
  { username: 'testbook_ugcnet',         subject: 'Common' },
  { username: 'pritipaper1',             subject: 'Paper 1' },
  { username: 'tulikamam',               subject: 'Paper 1' },
  { username: 'anshikamaamtestbook',     subject: 'Paper 1' },
  { username: 'testbookrajatsir',        subject: 'Paper 1' },
  { username: 'pradyumansir_testbook',   subject: 'Political Science' },
  { username: 'ashwanisir_testbook',     subject: 'History' },
  { username: 'kiranmaamtestbook',       subject: 'Public Administration' },
  { username: 'manojsonker_testbook',    subject: 'Sociology' },
  { username: 'heenamaam_testbook',      subject: 'Education' },
  { username: 'aditimaam_testbook',      subject: 'Home Science' },
  { username: 'karansir_testbook',       subject: 'Law' },
  { username: 'testbookdakshita',        subject: 'English' },
  { username: 'ashishsir_testbook',      subject: 'Geography' },
  { username: 'shachimaam_testbook',     subject: 'Economics' },
  { username: 'monikamaamtestbook',      subject: 'Management' },
  { username: 'yogitamaamtestbook',      subject: 'Management' },
  { username: 'evs_anshikamaamtestbook', subject: 'Environmental Science' },
  { username: 'daminimaam_testbook',     subject: 'Library Science' },
  { username: 'testbookshahna',          subject: 'Computer Science' },
  { username: 'prakashsirtestbook',      subject: 'Sanskrit' },
  { username: 'kesharisir_testbook',     subject: 'Hindi' },
  { username: 'testbookniharikamaam',    subject: 'Commerce' },
  { username: 'mrinalinimaam_testbook',  subject: 'Psychology' },
  { username: 'testbook_gauravsir',      subject: 'Physical Education' },
];

export async function GET() {
  if (!sb) return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });

  try {
    const [{ data: faculty, error: facErr }, { data: mappings, error: mapErr }] = await Promise.all([
      sb.from('tg_faculty')
        .select('email, name, primary_subject, active, notes, created_at, updated_at')
        .order('name', { ascending: true }),
      sb.from('tg_channel_faculty_map')
        .select('chat_username, faculty_email, subject, assigned_by, assigned_at, notes')
        .order('chat_username', { ascending: true }),
    ]);
    if (facErr) throw new Error('faculty: ' + facErr.message);
    if (mapErr) throw new Error('mappings: ' + mapErr.message);

    // Build per-faculty channel list
    const mapByFaculty = {};
    for (const m of (mappings || [])) {
      if (!m.faculty_email) continue;
      if (!mapByFaculty[m.faculty_email]) mapByFaculty[m.faculty_email] = [];
      mapByFaculty[m.faculty_email].push(m);
    }

    const facultyRows = (faculty || []).map((f) => ({
      ...f,
      channels: (mapByFaculty[f.email] || []).map((m) => ({
        chat_username: m.chat_username,
        subject:       m.subject,
        assigned_at:   m.assigned_at,
      })),
    }));

    // Unassigned channels = all_channels − channels in mapping with faculty_email set
    const assignedUsernames = new Set((mappings || []).filter((m) => m.faculty_email).map((m) => m.chat_username));
    const unassignedChannels = ALL_CHANNELS.filter((c) => !assignedUsernames.has(c.username));

    return Response.json({
      ok: true,
      faculty:    facultyRows,
      unassigned: unassignedChannels,
      meta: {
        total_faculty: facultyRows.length,
        total_channels: ALL_CHANNELS.length,
        assigned_channels: assignedUsernames.size,
        unassigned_channels: unassignedChannels.length,
      },
    });
  } catch (e) {
    console.error('[faculty GET]', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!sb) return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });

  try {
    const body = await request.json();
    const chat_username = (body.chat_username || '').toLowerCase().trim();
    const faculty_email = body.faculty_email ? body.faculty_email.toLowerCase().trim() : null;
    const subject       = body.subject || null;
    if (!chat_username) return Response.json({ ok: false, error: 'chat_username required' }, { status: 400 });

    // Validate channel exists in our canonical list
    if (!ALL_CHANNELS.find((c) => c.username.toLowerCase() === chat_username)) {
      return Response.json({ ok: false, error: 'unknown channel' }, { status: 400 });
    }

    // If faculty_email provided, validate it exists in faculty table
    if (faculty_email) {
      const { data: f, error: fErr } = await sb.from('tg_faculty').select('email').eq('email', faculty_email).maybeSingle();
      if (fErr) throw new Error('faculty lookup: ' + fErr.message);
      if (!f) return Response.json({ ok: false, error: 'faculty email not in registry' }, { status: 400 });
    }

    const { data, error: upErr } = await sb
      .from('tg_channel_faculty_map')
      .upsert({
        chat_username,
        faculty_email,
        subject: subject || ALL_CHANNELS.find((c) => c.username.toLowerCase() === chat_username)?.subject || null,
        assigned_by: 'ui',
        assigned_at: new Date().toISOString(),
      }, { onConflict: 'chat_username' })
      .select()
      .single();

    if (upErr) throw new Error('upsert: ' + upErr.message);
    return Response.json({ ok: true, mapping: data });
  } catch (e) {
    console.error('[faculty POST]', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
