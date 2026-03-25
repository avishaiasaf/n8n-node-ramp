import { INodeProperties } from 'n8n-workflow';

export const receiptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['receipt'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a receipt by ID',
				action: 'Get a receipt',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many receipts',
				action: 'Get many receipts',
			},
		],
		default: 'getAll',
	},
];

export const receiptFields: INodeProperties[] = [
	{
		displayName: 'Receipt ID',
		name: 'receiptId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['receipt'], operation: ['get'] },
		},
		description: 'The ID of the receipt to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['receipt'], operation: ['getAll'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['receipt'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['receipt'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				default: '',
				description: 'Filter receipts by user ID',
			},
			{
				displayName: 'Transaction ID',
				name: 'transaction_id',
				type: 'string',
				default: '',
				description: 'Filter receipts by transaction ID',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering receipts',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering receipts',
			},
		],
	},
];
