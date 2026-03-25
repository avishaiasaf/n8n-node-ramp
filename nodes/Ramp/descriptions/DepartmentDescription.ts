import { INodeProperties } from 'n8n-workflow';

export const departmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['department'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a department by ID',
				action: 'Get a department',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many departments',
				action: 'Get many departments',
			},
		],
		default: 'getAll',
	},
];

export const departmentFields: INodeProperties[] = [
	{
		displayName: 'Department ID',
		name: 'departmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['department'], operation: ['get'] },
		},
		description: 'The ID of the department to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['department'], operation: ['getAll'] },
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
			show: { resource: ['department'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
