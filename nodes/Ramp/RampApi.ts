import {
	IExecuteFunctions,
	IHookFunctions,
	IWebhookFunctions,
	ILoadOptionsFunctions,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Returns the base URL based on the environment credential.
 */
export function getBaseUrl(environment: string): string {
	return environment === 'production'
		? 'https://api.ramp.com'
		: 'https://demo-api.ramp.com';
}

/**
 * Obtains a fresh OAuth2 access token using Client Credentials flow.
 * Uses HTTP Basic Auth (clientId:clientSecret) on the token endpoint.
 */
export async function getAccessToken(
	context: IExecuteFunctions | IHookFunctions | IWebhookFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await context.getCredentials('rampApi');
	const baseUrl = getBaseUrl(credentials.environment as string);

	const response = await context.helpers.request({
		method: 'POST',
		url: `${baseUrl}/developer/v1/token`,
		auth: {
			user: credentials.clientId as string,
			pass: credentials.clientSecret as string,
		},
		form: {
			grant_type: 'client_credentials',
			scope:
				'transactions:read bills:read bills:write accounting:write webhooks:write entities:read accounting:read receipts:read',
		},
		json: true,
	});

	if (!response.access_token) {
		throw new NodeApiError(context.getNode(), response, {
			message: 'Failed to obtain Ramp access token',
		});
	}

	return response.access_token as string;
}

/**
 * Makes an authenticated request to the Ramp API.
 * Obtains a fresh token on each call (token is valid 10 days).
 * Implements exponential backoff on 429 responses.
 */
export async function rampApiRequest(
	context: IExecuteFunctions | IHookFunctions | IWebhookFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: object = {},
	qs: Record<string, string | number | boolean> = {},
): Promise<any> {
	const credentials = await context.getCredentials('rampApi');
	const baseUrl = getBaseUrl(credentials.environment as string);
	const token = await getAccessToken(context);

	const options: any = {
		method,
		url: `${baseUrl}/developer/v1${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length) {
		options.body = body;
	}

	const maxRetries = 3;
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await context.helpers.request(options);
		} catch (error: any) {
			const statusCode = error.statusCode || error.httpCode;
			if (statusCode === 429 && attempt < maxRetries) {
				const delay = Math.pow(2, attempt) * 1000;
				await new Promise((resolve) => setTimeout(resolve, delay));
				continue;
			}
			throw new NodeApiError(context.getNode(), error as any);
		}
	}
}

/**
 * Auto-paginate through Ramp cursor-based pagination.
 * Ramp uses { data: [...], page: { next: "cursor_token" } }
 */
export async function rampApiRequestAllItems(
	context: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	endpoint: string,
	qs: Record<string, string | number | boolean> = {},
): Promise<any[]> {
	const allItems: any[] = [];
	let cursor: string | undefined;

	do {
		const params = cursor ? { ...qs, start: cursor } : qs;
		const response = await rampApiRequest(context, 'GET', endpoint, {}, params);

		if (response.data) {
			allItems.push(...response.data);
		}

		cursor = response.page?.next;
	} while (cursor);

	return allItems;
}

/**
 * Chunk an array into batches of a given size.
 * Used for bulk uploads (GL accounts, vendors) with 500-item limit.
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}
