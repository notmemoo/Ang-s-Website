// Supabase Configuration
const SUPABASE_URL = 'https://uaduhurnbacunfbjpbxf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZHVodXJuYmFjdW5mYmpwYnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODAyNjEsImV4cCI6MjA4NDM1NjI2MX0.FRp7oXC5zdmtTYeQZlWu1AC0PSeUolZ3LK_lcy4it90';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
