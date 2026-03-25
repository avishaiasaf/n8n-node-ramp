import { INodeProperties } from 'n8n-workflow';

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['transfer'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a transfer by ID',
				action: 'Get a transfer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many transfers',
				action: 'Get many transfers',
			},
		],
		default: 'getAll',
	},
];

export const transferFields: INodeProperties[] = [
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['transfer'], operation: ['get'] },
		},
		description: 'The ID of the transfer to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['transfer'], operation: ['getAll'] },
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
			show: { resource: ['transfer'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
