import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RampApi implements ICredentialType {
	name = 'rampApi';
	displayName = 'Ramp API';
	documentationUrl = 'https://docs.ramp.com/developer-api/v1/overview';

	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{ name: 'Demo (Sandbox)', value: 'demo' },
				{ name: 'Production', value: 'production' },
			],
			default: 'demo',
			description:
				'Use Demo for testing, Production for live data. Each environment requires separate app credentials in Ramp.',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	// Credential test is handled programmatically via testedBy in the Ramp node
	// because authentication requires a token exchange step (client_credentials flow)
}
