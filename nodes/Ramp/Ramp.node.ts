import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

import { getBaseUrl, rampApiRequest, rampApiRequestAllItems, rampApiUploadFile } from './RampApi';

import {
	transactionOperations,
	transactionFields,
	reimbursementOperations,
	reimbursementFields,
	cardOperations,
	cardFields,
	billOperations,
	billFields,
	userOperations,
	userFields,
	businessOperations,
	businessFields,
	entityOperations,
	entityFields,
	webhookOperations,
	webhookFields,
	receiptOperations,
	receiptFields,
	departmentOperations,
	departmentFields,
	locationOperations,
	locationFields,
	vendorOperations,
	vendorFields,
	merchantOperations,
	merchantFields,
	memoOperations,
	memoFields,
	limitOperations,
	limitFields,
	cashbackOperations,
	cashbackFields,
	transferOperations,
	transferFields,
} from './descriptions';

export class Ramp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ramp',
		name: 'ramp',
		icon: 'file:ramp.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Ramp spend management API',
		defaults: { name: 'Ramp' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'rampApi',
				required: true,
				testedBy: 'rampApiCredentialTest',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Bill', value: 'bill' },
					{ name: 'Business', value: 'business' },
					{ name: 'Card', value: 'card' },
					{ name: 'Cashback', value: 'cashback' },
					{ name: 'Department', value: 'department' },
					{ name: 'Entity', value: 'entity' },
					{ name: 'Limit', value: 'limit' },
					{ name: 'Location', value: 'location' },
					{ name: 'Memo', value: 'memo' },
					{ name: 'Merchant', value: 'merchant' },
					{ name: 'Receipt', value: 'receipt' },
					{ name: 'Reimbursement', value: 'reimbursement' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Transfer', value: 'transfer' },
					{ name: 'User', value: 'user' },
					{ name: 'Vendor', value: 'vendor' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'transaction',
			},
			...transactionOperations,
			...transactionFields,
			...reimbursementOperations,
			...reimbursementFields,
			...cardOperations,
			...cardFields,
			...billOperations,
			...billFields,
			...userOperations,
			...userFields,
			...businessOperations,
			...businessFields,
			...entityOperations,
			...entityFields,
			...webhookOperations,
			...webhookFields,
			...receiptOperations,
			...receiptFields,
			...departmentOperations,
			...departmentFields,
			...locationOperations,
			...locationFields,
			...vendorOperations,
			...vendorFields,
			...merchantOperations,
			...merchantFields,
			...memoOperations,
			...memoFields,
			...limitOperations,
			...limitFields,
			...cashbackOperations,
			...cashbackFields,
			...transferOperations,
			...transferFields,
		],
	};

	methods = {
		credentialTest: {
			async rampApiCredentialTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const { environment, clientId, clientSecret } = credential.data!;
				const baseUrl = getBaseUrl(environment as string);

				try {
					const tokenResponse = await this.helpers.request({
						method: 'POST',
						url: `${baseUrl}/developer/v1/token`,
						auth: {
							user: clientId as string,
							pass: clientSecret as string,
						},
						form: {
							grant_type: 'client_credentials',
							scope: 'business:read transactions:read bills:read bills:write accounting:write webhooks:write entities:read accounting:read receipts:read departments:read locations:read merchants:read limits:read transfers:read cashbacks:read memos:read',
						},
						json: true,
					});

					if (!tokenResponse.access_token) {
						return {
							status: 'Error',
							message: 'Token response did not contain an access token',
						};
					}

					await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/developer/v1/business`,
						headers: {
							Authorization: `Bearer ${tokenResponse.access_token}`,
						},
						json: true,
					});

					return { status: 'OK', message: 'Connection successful' };
				} catch (error: any) {
					const message = error.message || 'Unknown error';
					return {
						status: 'Error',
						message: `Connection failed: ${message}`,
					};
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// ── Transaction ──────────────────────────────────────────
				if (resource === 'transaction') {
					if (operation === 'get') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						const includeMerchantData = this.getNodeParameter('includeMerchantData', i) as boolean;
						const qs: Record<string, string> = {};
						if (includeMerchantData) {
							qs.include = 'include_merchant_data';
						}
						responseData = await rampApiRequest(this, 'GET', `/transactions/${transactionId}`, {}, qs);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as Record<string, any>;
						const qs: Record<string, string | number | boolean> = {};

						if (filters.sync_status) qs.sync_status = filters.sync_status;
						if (filters.from_date) qs.from_date = filters.from_date;
						if (filters.to_date) qs.to_date = filters.to_date;
						if (filters.department_id) qs.department_id = filters.department_id;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/transactions', qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await rampApiRequest(this, 'GET', '/transactions', {}, qs);
							responseData = response.data || [];
						}
					}
				}

				// ── Reimbursement ────────────────────────────────────────
				else if (resource === 'reimbursement') {
					if (operation === 'get') {
						const reimbursementId = this.getNodeParameter('reimbursementId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/reimbursements/${reimbursementId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as Record<string, any>;
						const qs: Record<string, string | number | boolean> = {};

						if (filters.sync_status) qs.sync_status = filters.sync_status;
						if (filters.state) qs.state = filters.state;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/reimbursements', qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await rampApiRequest(this, 'GET', '/reimbursements', {}, qs);
							responseData = response.data || [];
						}
					}
				}

				// ── Card ─────────────────────────────────────────────────
				else if (resource === 'card') {
					if (operation === 'get') {
						const cardId = this.getNodeParameter('cardId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/cards/${cardId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/cards');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/cards', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Bill ─────────────────────────────────────────────────
				else if (resource === 'bill') {
					if (operation === 'get') {
						const billId = this.getNodeParameter('billId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/bills/${billId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as Record<string, any>;
						const qs: Record<string, string | number | boolean> = {};

						if (filters.sync_status) qs.sync_status = filters.sync_status;
						if (filters.approval_status) qs.approval_status = filters.approval_status;
						if (filters.vendor_id) qs.vendor_id = filters.vendor_id;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/bills', qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await rampApiRequest(this, 'GET', '/bills', {}, qs);
							responseData = response.data || [];
						}
					} else if (operation === 'uploadAttachment') {
						const billId = this.getNodeParameter('billId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const attachmentType = this.getNodeParameter('attachmentType', i) as string;
						responseData = await rampApiUploadFile(
							this,
							`/bills/${billId}/attachments`,
							binaryPropertyName,
							i,
							{ attachment_type: attachmentType },
						);
					} else if (operation === 'uploadDraftAttachment') {
						const draftBillId = this.getNodeParameter('draftBillId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const attachmentType = this.getNodeParameter('attachmentType', i) as string;
						responseData = await rampApiUploadFile(
							this,
							`/bills/drafts/${draftBillId}/attachments`,
							binaryPropertyName,
							i,
							{ attachment_type: attachmentType },
						);
					}
				}

				// ── User ─────────────────────────────────────────────────
				else if (resource === 'user') {
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/users/${userId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/users');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/users', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Business ─────────────────────────────────────────────
				else if (resource === 'business') {
					if (operation === 'getInfo') {
						responseData = await rampApiRequest(this, 'GET', '/business');
					} else if (operation === 'getBalance') {
						responseData = await rampApiRequest(this, 'GET', '/business/balance');
					}
				}

				// ── Entity ───────────────────────────────────────────────
				else if (resource === 'entity') {
					if (operation === 'get') {
						const entityId = this.getNodeParameter('entityId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/entities/${entityId}`);
					}
				}

				// ── Receipt ──────────────────────────────────────────────
				else if (resource === 'receipt') {
					if (operation === 'get') {
						const receiptId = this.getNodeParameter('receiptId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/receipts/${receiptId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as Record<string, any>;
						const qs: Record<string, string | number | boolean> = {};

						if (filters.user_id) qs.user_id = filters.user_id;
						if (filters.transaction_id) qs.transaction_id = filters.transaction_id;
						if (filters.from_date) qs.from_date = filters.from_date;
						if (filters.to_date) qs.to_date = filters.to_date;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/receipts', qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await rampApiRequest(this, 'GET', '/receipts', {}, qs);
							responseData = response.data || [];
						}
					}
				}

				// ── Department ───────────────────────────────────────────
				else if (resource === 'department') {
					if (operation === 'get') {
						const departmentId = this.getNodeParameter('departmentId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/departments/${departmentId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/departments');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/departments', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Location ─────────────────────────────────────────────
				else if (resource === 'location') {
					if (operation === 'get') {
						const locationId = this.getNodeParameter('locationId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/locations/${locationId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/locations');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/locations', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Vendor (Accounting) ──────────────────────────────────
				else if (resource === 'vendor') {
					if (operation === 'get') {
						const vendorId = this.getNodeParameter('vendorId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/accounting/vendors/${vendorId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/accounting/vendors');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/accounting/vendors', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Merchant ─────────────────────────────────────────────
				else if (resource === 'merchant') {
					if (operation === 'get') {
						const merchantId = this.getNodeParameter('merchantId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/merchants/${merchantId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/merchants');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/merchants', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Memo ─────────────────────────────────────────────────
				else if (resource === 'memo') {
					if (operation === 'get') {
						const memoId = this.getNodeParameter('memoId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/memos/${memoId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/memos');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/memos', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Limit ────────────────────────────────────────────────
				else if (resource === 'limit') {
					if (operation === 'get') {
						const limitId = this.getNodeParameter('limitId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/limits/${limitId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/limits');
						} else {
							const limitValue = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/limits', {}, { page_size: limitValue });
							responseData = response.data || [];
						}
					}
				}

				// ── Cashback ─────────────────────────────────────────────
				else if (resource === 'cashback') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/cashbacks');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/cashbacks', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Transfer ─────────────────────────────────────────────
				else if (resource === 'transfer') {
					if (operation === 'get') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await rampApiRequest(this, 'GET', `/transfers/${transferId}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await rampApiRequestAllItems(this, '/transfers');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await rampApiRequest(this, 'GET', '/transfers', {}, { page_size: limit });
							responseData = response.data || [];
						}
					}
				}

				// ── Webhook ──────────────────────────────────────────────
				else if (resource === 'webhook') {
					if (operation === 'getAll') {
						const response = await rampApiRequest(this, 'GET', '/webhooks');
						responseData = response.data || [];
					} else if (operation === 'create') {
						const endpointUrl = this.getNodeParameter('endpointUrl', i) as string;
						const eventTypes = this.getNodeParameter('eventTypes', i) as string[];
						responseData = await rampApiRequest(this, 'POST', '/webhooks', {
							endpoint_url: endpointUrl,
							event_types: eventTypes,
						});
					} else if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await rampApiRequest(this, 'DELETE', `/webhooks/${webhookId}`);
					}
				}

				// ── Return data ──────────────────────────────────────────
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
