import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	async function featured() {
		const { data } = await supabase.from('shows').select('*').eq('featured', true);
		return data ?? [];
	}

	console.log(featured);
	return {
		featured: featured(),
		mobile: false
	};
};
