import { supabase } from './supabaseClient.js'

const storageKey = 'medadStudyLinks'

function readLocalLinks() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(stored)) return []
    const normalized = stored.map((link) => ({ ...link, id: link.id || crypto.randomUUID() }))
    if (normalized.some((link, index) => link.id !== stored[index].id)) writeLocalLinks(normalized)
    return normalized
  } catch {
    return []
  }
}

function writeLocalLinks(links) {
  localStorage.setItem(storageKey, JSON.stringify(links))
}

export async function loadLinks(user) {
  if (!supabase) return readLocalLinks()
  if (!user) return []

  const { data, error } = await supabase
    .from('study_resources')
    .select('id, title, url, subject_id, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    name: row.title,
    url: row.url,
    subject: row.subject_id,
  }))
}

export async function createLink(user, link) {
  if (!supabase) {
    const local = readLocalLinks()
    const created = { ...link, id: crypto.randomUUID() }
    local.push(created)
    writeLocalLinks(local)
    return created
  }
  if (!user) throw new Error('سجّل الدخول أولًا لحفظ الرابط في حسابك.')

  const { data, error } = await supabase
    .from('study_resources')
    .insert({
      user_id: user.id,
      subject_id: link.subject,
      title: link.name,
      url: link.url,
    })
    .select('id, title, url, subject_id, created_at')
    .single()

  if (error) throw error
  return { id: data.id, name: data.title, url: data.url, subject: data.subject_id }
}

export async function removeLink(user, linkId) {
  if (!supabase) {
    writeLocalLinks(readLocalLinks().filter((link) => link.id !== linkId))
    return
  }
  if (!user) throw new Error('سجّل الدخول لحذف الرابط.')

  const { error } = await supabase
    .from('study_resources')
    .delete()
    .eq('id', linkId)

  if (error) throw error
}

