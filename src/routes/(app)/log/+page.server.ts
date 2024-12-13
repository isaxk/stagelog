import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { data, error } = await supabase.from('shows').select('*').eq('featured', true);
	const featured = data ?? [];
  console.log(featured)
  return {
    featured,
    mobile: false
  }
};
