import { INodeProperties } from 'n8n-workflow';

export const merchantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['merchant'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a merchant by ID',
				action: 'Get a merchant',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many merchants',
				action: 'Get many merchants',
			},
		],
		default: 'getAll',
	},
];

export const merchantFields: INodeProperties[] = [
	{
		displayName: 'Merchant ID',
		name: 'merchantId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['merchant'], operation: ['get'] },
		},
		description: 'The ID of the merchant to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['merchant'], operation: ['getAll'] },
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
			show: { resource: ['merchant'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
