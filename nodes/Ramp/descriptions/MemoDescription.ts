import { INodeProperties } from 'n8n-workflow';

export const memoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['memo'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a memo by ID',
				action: 'Get a memo',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many memos',
				action: 'Get many memos',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a memo on a transaction, receipt, or reimbursement',
				action: 'Update a memo',
			},
		],
		default: 'getAll',
	},
];

export const memoFields: INodeProperties[] = [
	{
		displayName: 'Memo ID',
		name: 'memoId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['memo'], operation: ['get', 'update'] },
		},
		description: 'The ID of the memo',
	},

	// ----------------------------------
	//         memo: update
	// ----------------------------------
	{
		displayName: 'Memo Text',
		name: 'memo',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['memo'], operation: ['update'] },
		},
		description: 'The updated memo text',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['memo'], operation: ['getAll'] },
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
			show: { resource: ['memo'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
