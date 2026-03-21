import { INodeProperties } from 'n8n-workflow';

export const billOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['bill'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a bill by ID',
				action: 'Get a bill',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many bills',
				action: 'Get many bills',
			},
		],
		default: 'getAll',
	},
];

export const billFields: INodeProperties[] = [
	// ----------------------------------
	//           bill: get
	// ----------------------------------
	{
		displayName: 'Bill ID',
		name: 'billId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bill'], operation: ['get'] },
		},
		description: 'The ID of the bill to retrieve',
	},

	// ----------------------------------
	//           bill: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['bill'], operation: ['getAll'] },
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
			show: { resource: ['bill'], operation: ['getAll'], returnAll: [false] },
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
			show: { resource: ['bill'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'Sync Status',
				name: 'sync_status',
				type: 'options',
				options: [
					{ name: 'Sync Ready', value: 'SYNC_READY' },
					{ name: 'Synced', value: 'SYNCED' },
					{ name: 'Not Synced', value: 'NOT_SYNCED' },
				],
				default: 'SYNC_READY',
				description: 'Filter by accounting sync status',
			},
			{
				displayName: 'Approval Status',
				name: 'approval_status',
				type: 'options',
				options: [
					{ name: 'Approved', value: 'APPROVED' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Rejected', value: 'REJECTED' },
				],
				default: 'APPROVED',
				description: 'Filter by approval status',
			},
			{
				displayName: 'Vendor ID',
				name: 'vendor_id',
				type: 'string',
				default: '',
				description: 'Filter by vendor ID',
			},
		],
	},
];
