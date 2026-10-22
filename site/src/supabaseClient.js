import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0?bundle'
import { supabaseConfig } from './supabaseConfig.js'

const { url, publishableKey } = supabaseConfig

export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null
