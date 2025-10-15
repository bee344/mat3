//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LogisticsEventsModule#LogisticsEvents
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const logisticsEventsModuleLogisticsEventsAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProviderAuthorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProviderRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'shipmentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'batch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'origin',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'destination',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ShipmentCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'shipmentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'status',
        internalType: 'enum LogisticsEvents.ShipmentStatus',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'updatedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ShipmentStatusChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'shipmentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'batch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'origin',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'destination',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'previousBlockHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'previousShipmentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ShipmentUpdated',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'address', type: 'address' }],
    name: 'authorizeProvider',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'authorizedProviders',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct LogisticsEvents.ShipmentData',
        type: 'tuple',
        components: [
          { name: 'shipmentId', internalType: 'uint256', type: 'uint256' },
          { name: 'weight', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'batch', internalType: 'uint256', type: 'uint256' },
          { name: 'origin', internalType: 'string', type: 'string' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'destination', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'createShipment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'address', type: 'address' }],
    name: 'revokeProvider',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'shipmentExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct LogisticsEvents.ShipmentUpdateData',
        type: 'tuple',
        components: [
          {
            name: 'shipment',
            internalType: 'struct LogisticsEvents.ShipmentData',
            type: 'tuple',
            components: [
              { name: 'shipmentId', internalType: 'uint256', type: 'uint256' },
              { name: 'weight', internalType: 'uint256', type: 'uint256' },
              { name: 'price', internalType: 'uint256', type: 'uint256' },
              { name: 'batch', internalType: 'uint256', type: 'uint256' },
              { name: 'origin', internalType: 'string', type: 'string' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              { name: 'destination', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'previousBlockHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'previousShipmentId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'updateShipment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shipmentId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum LogisticsEvents.ShipmentStatus',
        type: 'uint8',
      },
    ],
    name: 'updateShipmentStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'shipmentId', internalType: 'uint256', type: 'uint256' }],
    name: 'verifyShipment',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

/**
 *
 */
export const logisticsEventsModuleLogisticsEventsAddress = {
  420420422: '0x2A8fa81e5f03340a8fF2A3Bc18Ec3B1743eD9015',
} as const

/**
 *
 */
export const logisticsEventsModuleLogisticsEventsConfig = {
  address: logisticsEventsModuleLogisticsEventsAddress,
  abi: logisticsEventsModuleLogisticsEventsAbi,
} as const
