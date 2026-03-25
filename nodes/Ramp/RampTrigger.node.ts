import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { rampApiRequest } from './RampApi';

import * as crypto from 'crypto';

export class RampTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ramp Trigger',
		name: 'rampTrigger',
		icon: 'file:ramp.png',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Ramp fires a webhook event',
		defaults: { name: 'Ramp Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'rampApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'ramp',
				isFullPath: false,
			},
		],
		properties: [
			{
				displayName: 'Event Types',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Bill Approved', value: 'bills.approved' },
					{ name: 'Bill Created', value: 'bills.created' },
					{ name: 'Reimbursement Ready to Sync', value: 'reimbursements.ready_to_sync' },
					{ name: 'Transaction Cleared', value: 'transactions.cleared' },
					{ name: 'Transaction Ready to Sync', value: 'transactions.ready_to_sync' },
				],
				default: ['transactions.ready_to_sync'],
				required: true,
				description: 'The event types to listen for',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (!webhookData.webhookId) return false;

				try {
					const webhooks = await rampApiRequest(this, 'GET', '/webhooks');
					const exists = webhooks.data?.some(
						(wh: any) => wh.id === webhookData.webhookId,
					);
					return !!exists;
				} catch {
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];

				const response = await rampApiRequest(this, 'POST', '/webhooks', {
					endpoint_url: webhookUrl,
					event_types: events,
				});

				// CRITICAL: Ramp returns both id and secret at creation time.
				// The secret is ONLY available here — never returned again.
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;
				webhookData.webhookSecret = response.secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await rampApiRequest(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch (error) {
						// Webhook may already be gone — don't throw
						console.error('Failed to delete Ramp webhook:', error);
					}

					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as Record<string, any>;
		const webhookData = this.getWorkflowStaticData('node');

		// ── Step 1: Challenge handshake ──────────────────────────────────
		if (body.challenge) {
			await rampApiRequest(
				this,
				'POST',
				`/webhooks/${webhookData.webhookId}/verify`,
				{ challenge: body.challenge },
			);

			webhookData.webhookStatus = 'active';

			return {
				webhookResponse: { status: 200 },
				workflowData: [[]],
			};
		}

		// ── Step 2: HMAC verification ───────────────────────────────────
		const headers = this.getHeaderData() as Record<string, string>;
		const rampSignature = headers['x-ramp-signature'];

		if (!rampSignature) {
			return {
				webhookResponse: { status: 401, body: 'Missing X-Ramp-Signature header' },
				workflowData: [[]],
			};
		}

		const secret = webhookData.webhookSecret as string;
		const rawBody = JSON.stringify(body);
		const computedSig = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');

		const sigBuffer = Buffer.from(rampSignature);
		const computedBuffer = Buffer.from(computedSig);

		if (
			sigBuffer.length !== computedBuffer.length ||
			!crypto.timingSafeEqual(sigBuffer, computedBuffer)
		) {
			return {
				webhookResponse: { status: 401, body: 'Invalid webhook signature' },
				workflowData: [[]],
			};
		}

		// ── Step 3: Emit to workflow ────────────────────────────────────
		return {
			webhookResponse: { status: 200 },
			workflowData: [
				this.helpers.returnJsonArray([
					{
						event_type: body.type,
						object_id: body.object?.id,
						timestamp: body.created_at,
						verified: true,
						data: body,
					},
				]),
			],
		};
	}
}
