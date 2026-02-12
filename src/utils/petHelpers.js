import { supabase } from '../lib/supabaseClient';

export async function checkSlugAvailability(slug) {
  const { data, error } = await supabase
    .from('pets')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
    
  if (error) {
    console.error('Error checking slug:', error);
    return false;
  }
  
  return !data;
}

export function generateSlugSuggestion(slug) {
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${slug}-${randomSuffix}`;
}
