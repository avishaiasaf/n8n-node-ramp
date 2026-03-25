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
			{
				name: 'Upload Attachment',
				value: 'uploadAttachment',
				description: 'Upload an attachment to a finalized bill',
				action: 'Upload attachment to a bill',
			},
			{
				name: 'Upload Draft Attachment',
				value: 'uploadDraftAttachment',
				description: 'Upload an attachment to a draft bill',
				action: 'Upload attachment to a draft bill',
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
			show: { resource: ['bill'], operation: ['get', 'uploadAttachment'] },
		},
		description: 'The ID of the bill',
	},

	// ----------------------------------
	//     bill: uploadDraftAttachment
	// ----------------------------------
	{
		displayName: 'Draft Bill ID',
		name: 'draftBillId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bill'], operation: ['uploadDraftAttachment'] },
		},
		description: 'The ID of the draft bill',
	},

	// ----------------------------------
	//  bill: uploadAttachment / uploadDraftAttachment
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: { resource: ['bill'], operation: ['uploadAttachment', 'uploadDraftAttachment'] },
		},
		description: 'Name of the binary property containing the file to upload',
	},
	{
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{ name: 'Invoice', value: 'INVOICE' },
			{ name: 'Other', value: 'OTHER' },
		],
		default: 'INVOICE',
		displayOptions: {
			show: { resource: ['bill'], operation: ['uploadAttachment', 'uploadDraftAttachment'] },
		},
		description: 'The type of attachment. Note: only one INVOICE attachment is allowed per bill.',
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
