export async function GET() {
	return new Response('Authentication is handled by the local login page.', {
		status: 404,
		headers: { 'Content-Type': 'text/plain' },
	})
}

export async function POST() {
	return new Response('Authentication is handled by the local login page.', {
		status: 404,
		headers: { 'Content-Type': 'text/plain' },
	})
}
