import { INodeProperties } from 'n8n-workflow';

export const businessOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['business'] },
		},
		options: [
			{
				name: 'Get Info',
				value: 'getInfo',
				description: 'Get business information',
				action: 'Get business info',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get business balance',
				action: 'Get business balance',
			},
		],
		default: 'getInfo',
	},
];

export const businessFields: INodeProperties[] = [];
