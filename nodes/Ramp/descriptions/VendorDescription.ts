import { INodeProperties } from 'n8n-workflow';

export const vendorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['vendor'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an accounting vendor by ID',
				action: 'Get a vendor',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many accounting vendors',
				action: 'Get many vendors',
			},
		],
		default: 'getAll',
	},
];

export const vendorFields: INodeProperties[] = [
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['vendor'], operation: ['get'] },
		},
		description: 'The ID of the accounting vendor to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['vendor'], operation: ['getAll'] },
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
			show: { resource: ['vendor'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
