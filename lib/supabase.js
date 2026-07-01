import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://vyehmxckrewshcrpjesf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZWhteGNrcmV3c2hjcnBqZXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTQ1ODgsImV4cCI6MjA5Nzc3MDU4OH0.vPsIPQdIHHezHEwtzdqqpcY2ka0uc8Mx36ET2ucY18I';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);