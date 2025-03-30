// Supabase client initialization
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://gfdtbauhbzbzavrrzvzd.supabase.co';
const supabaseKey = 'YOUR_API_KEY'; // Replace with your actual API key for security reasons
const supabase = createClient(supabaseUrl, supabaseKey);

// Export for use in other files
export default supabase;