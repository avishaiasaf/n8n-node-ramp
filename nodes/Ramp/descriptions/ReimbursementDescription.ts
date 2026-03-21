import { INodeProperties } from 'n8n-workflow';

export const reimbursementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['reimbursement'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a reimbursement by ID',
				action: 'Get a reimbursement',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many reimbursements',
				action: 'Get many reimbursements',
			},
		],
		default: 'getAll',
	},
];

export const reimbursementFields: INodeProperties[] = [
	// ----------------------------------
	//       reimbursement: get
	// ----------------------------------
	{
		displayName: 'Reimbursement ID',
		name: 'reimbursementId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['reimbursement'], operation: ['get'] },
		},
		description: 'The ID of the reimbursement to retrieve',
	},

	// ----------------------------------
	//       reimbursement: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['reimbursement'], operation: ['getAll'] },
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
			show: { resource: ['reimbursement'], operation: ['getAll'], returnAll: [false] },
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
			show: { resource: ['reimbursement'], operation: ['getAll'] },
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
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Approved', value: 'APPROVED' },
					{ name: 'Rejected', value: 'REJECTED' },
				],
				default: 'APPROVED',
				description: 'Filter by reimbursement state',
			},
		],
	},
];
