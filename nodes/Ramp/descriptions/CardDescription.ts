import { INodeProperties } from 'n8n-workflow';

export const cardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['card'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a card by ID',
				action: 'Get a card',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many cards',
				action: 'Get many cards',
			},
		],
		default: 'getAll',
	},
];

export const cardFields: INodeProperties[] = [
	// ----------------------------------
	//           card: get
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['card'], operation: ['get'] },
		},
		description: 'The ID of the card to retrieve',
	},

	// ----------------------------------
	//           card: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['card'], operation: ['getAll'] },
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
			show: { resource: ['card'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
];
