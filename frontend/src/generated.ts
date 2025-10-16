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
        name: 'batch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stage',
        internalType: 'enum LogisticsEvents.ShipmentStage',
        type: 'uint8',
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
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ShipmentDetails',
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
        name: 'originLat',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'originLong',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'destLat',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'destLong',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ShipmentLocation',
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
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ShipmentUpdateDetails',
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
        name: 'originLat',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'originLong',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'destLat',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'destLong',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ShipmentUpdateLocation',
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
        name: 'batch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stage',
        internalType: 'enum LogisticsEvents.ShipmentStage',
        type: 'uint8',
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
          { name: 'weight', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'batch', internalType: 'uint256', type: 'uint256' },
          {
            name: 'origin',
            internalType: 'struct LogisticsEvents.Location',
            type: 'tuple',
            components: [
              { name: 'longitud', internalType: 'string', type: 'string' },
              { name: 'latitud', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'destination',
            internalType: 'struct LogisticsEvents.Location',
            type: 'tuple',
            components: [
              { name: 'longitud', internalType: 'string', type: 'string' },
              { name: 'latitud', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'stage',
            internalType: 'enum LogisticsEvents.ShipmentStage',
            type: 'uint8',
          },
        ],
      },
    ],
    name: 'createShipment',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextShipmentId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
              { name: 'weight', internalType: 'uint256', type: 'uint256' },
              { name: 'price', internalType: 'uint256', type: 'uint256' },
              { name: 'batch', internalType: 'uint256', type: 'uint256' },
              {
                name: 'origin',
                internalType: 'struct LogisticsEvents.Location',
                type: 'tuple',
                components: [
                  { name: 'longitud', internalType: 'string', type: 'string' },
                  { name: 'latitud', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'destination',
                internalType: 'struct LogisticsEvents.Location',
                type: 'tuple',
                components: [
                  { name: 'longitud', internalType: 'string', type: 'string' },
                  { name: 'latitud', internalType: 'string', type: 'string' },
                ],
              },
              { name: 'description', internalType: 'string', type: 'string' },
              {
                name: 'stage',
                internalType: 'enum LogisticsEvents.ShipmentStage',
                type: 'uint8',
              },
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
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const logisticsEventsModuleLogisticsEventsAddress = {
  420420422: '0x9C8aFF47F478126d9862385b97774e809b4C53Da',
} as const

/**
 *
 */
export const logisticsEventsModuleLogisticsEventsConfig = {
  address: logisticsEventsModuleLogisticsEventsAddress,
  abi: logisticsEventsModuleLogisticsEventsAbi,
} as const
