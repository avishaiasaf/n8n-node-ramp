import { INodeProperties } from 'n8n-workflow';

export const locationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['location'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a location by ID',
				action: 'Get a location',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many locations',
				action: 'Get many locations',
			},
		],
		default: 'getAll',
	},
];

export const locationFields: INodeProperties[] = [
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['location'], operation: ['get'] },
		},
		description: 'The ID of the location to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['location'], operation: ['getAll'] },
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
			show: { resource: ['location'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
