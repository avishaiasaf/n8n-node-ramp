import { INodeProperties } from 'n8n-workflow';

export const limitOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['limit'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a spending limit by ID',
				action: 'Get a limit',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many spending limits',
				action: 'Get many limits',
			},
		],
		default: 'getAll',
	},
];

export const limitFields: INodeProperties[] = [
	{
		displayName: 'Limit ID',
		name: 'limitId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['limit'], operation: ['get'] },
		},
		description: 'The ID of the spending limit to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['limit'], operation: ['getAll'] },
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
			show: { resource: ['limit'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
