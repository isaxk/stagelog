import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, url }) => {
	const { session, user } = await safeGetSession();

	if (!session && !url.pathname.includes('user')) {
		redirect(301, '/');
	}
};
