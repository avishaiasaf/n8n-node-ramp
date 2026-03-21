import { INodeProperties } from 'n8n-workflow';

export const entityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['entity'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an entity by ID',
				action: 'Get an entity',
			},
		],
		default: 'get',
	},
];

export const entityFields: INodeProperties[] = [
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['entity'], operation: ['get'] },
		},
		description: 'The ID of the entity (legal entity / subsidiary) to retrieve',
	},
];
