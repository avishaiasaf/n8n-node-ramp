import { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['transaction'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a transaction by ID',
				action: 'Get a transaction',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many transactions',
				action: 'Get many transactions',
			},
		],
		default: 'getAll',
	},
];

export const transactionFields: INodeProperties[] = [
	// ----------------------------------
	//         transaction: get
	// ----------------------------------
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['transaction'], operation: ['get'] },
		},
		description: 'The ID of the transaction to retrieve',
	},
	{
		displayName: 'Include Merchant Data',
		name: 'includeMerchantData',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['transaction'], operation: ['get'] },
		},
		description: 'Whether to include additional merchant data in the response',
	},

	// ----------------------------------
	//         transaction: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['transaction'], operation: ['getAll'] },
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
			show: { resource: ['transaction'], operation: ['getAll'], returnAll: [false] },
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
			show: { resource: ['transaction'], operation: ['getAll'] },
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
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering transactions',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering transactions',
			},
			{
				displayName: 'Department ID',
				name: 'department_id',
				type: 'string',
				default: '',
				description: 'Filter by department ID',
			},
		],
	},
];
