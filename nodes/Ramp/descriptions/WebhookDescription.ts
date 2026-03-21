import { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['webhook'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many webhooks',
				action: 'Get many webhooks',
			},
		],
		default: 'getAll',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//        webhook: create
	// ----------------------------------
	{
		displayName: 'Endpoint URL',
		name: 'endpointUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['webhook'], operation: ['create'] },
		},
		description: 'The URL that will receive webhook events',
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: { resource: ['webhook'], operation: ['create'] },
		},
		options: [
			{ name: 'Bill Approved', value: 'bills.approved' },
			{ name: 'Bill Created', value: 'bills.created' },
			{ name: 'Reimbursement Ready to Sync', value: 'reimbursements.ready_to_sync' },
			{ name: 'Transaction Cleared', value: 'transactions.cleared' },
			{ name: 'Transaction Ready to Sync', value: 'transactions.ready_to_sync' },
		],
		default: [],
		description: 'The event types this webhook should listen for',
	},

	// ----------------------------------
	//        webhook: delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['webhook'], operation: ['delete'] },
		},
		description: 'The ID of the webhook to delete',
	},
];
