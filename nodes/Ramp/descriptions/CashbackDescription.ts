import { INodeProperties } from 'n8n-workflow';

export const cashbackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['cashback'] },
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many cashback transactions',
				action: 'Get many cashbacks',
			},
		],
		default: 'getAll',
	},
];

export const cashbackFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['cashback'], operation: ['getAll'] },
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
			show: { resource: ['cashback'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
