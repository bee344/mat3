// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LogisticsEvents {
    address public owner;
    
    // Track authorized logistics providers
    mapping(address => bool) public authorizedProviders;
    
    // Track which shipment IDs have been used
    mapping(uint256 => bool) public shipmentExists;
    
    // Track shipment status
    enum ShipmentStatus { Created, InTransit, Delivered, Cancelled }

    constructor() {
        owner = msg.sender;
        authorizedProviders[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: owner only");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedProviders[msg.sender], "Not authorized: provider only");
        _;
    }

    struct ShipmentData {
        uint256 shipmentId;
        uint256 weight;
        uint256 price;
        uint256 batch;
        string origin;
        address receiver;
        string destination;
        string description;
    }

    struct ShipmentUpdateData {
        ShipmentData shipment;
        bytes32 previousBlockHash;
        uint256 previousShipmentId;
    }

    event ShipmentCreated(
        uint256 indexed shipmentId,
        uint256 weight,
        uint256 price,
        uint256 indexed batch,
        string origin,
        address indexed sender,
        address receiver,
        string destination,
        string description,
        uint256 timestamp
    );

    event ShipmentUpdated(
        uint256 indexed shipmentId,
        uint256 weight,
        uint256 price,
        uint256 indexed batch,
        string origin,
        address indexed sender,
        address receiver,
        string destination,
        string description,
        bytes32 previousBlockHash,
        uint256 previousShipmentId,
        uint256 timestamp
    );
    
    event ShipmentStatusChanged(
        uint256 indexed shipmentId,
        ShipmentStatus indexed status,
        address indexed updatedBy,
        uint256 timestamp
    );
    
    event ProviderAuthorized(address indexed provider, uint256 timestamp);
    event ProviderRevoked(address indexed provider, uint256 timestamp);

    // Authorization management
    function authorizeProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider address");
        require(!authorizedProviders[provider], "Provider already authorized");
        
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider, block.timestamp);
    }
    
    function revokeProvider(address provider) external onlyOwner {
        require(provider != owner, "Cannot revoke owner");
        require(authorizedProviders[provider], "Provider not authorized");
        
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider, block.timestamp);
    }

    function createShipment(ShipmentData calldata data) external onlyAuthorized {
        // Validation
        require(!shipmentExists[data.shipmentId], "Shipment ID already exists");
        require(data.weight > 0, "Weight must be greater than 0");
        require(data.price > 0, "Price must be greater than 0");
        require(bytes(data.origin).length > 0, "Origin cannot be empty");
        require(bytes(data.destination).length > 0, "Destination cannot be empty");
        require(data.receiver != address(0), "Invalid receiver address");
        
        // Mark shipment as existing
        shipmentExists[data.shipmentId] = true;
        
        emit ShipmentCreated(
            data.shipmentId,
            data.weight,
            data.price,
            data.batch,
            data.origin,
            msg.sender,
            data.receiver,
            data.destination,
            data.description,
            block.timestamp
        );
    }

    function updateShipment(ShipmentUpdateData calldata data) external onlyAuthorized {
        // Validation
        require(shipmentExists[data.shipment.shipmentId], "Shipment does not exist");
        require(data.shipment.weight > 0, "Weight must be greater than 0");
        require(data.shipment.price > 0, "Price must be greater than 0");
        require(bytes(data.shipment.origin).length > 0, "Origin cannot be empty");
        require(bytes(data.shipment.destination).length > 0, "Destination cannot be empty");
        require(data.shipment.receiver != address(0), "Invalid receiver address");
        
        // Validate previous shipment reference if provided
        if (data.previousShipmentId != 0) {
            require(shipmentExists[data.previousShipmentId], "Previous shipment does not exist");
        }
        
        emit ShipmentUpdated(
            data.shipment.shipmentId,
            data.shipment.weight,
            data.shipment.price,
            data.shipment.batch,
            data.shipment.origin,
            msg.sender,
            data.shipment.receiver,
            data.shipment.destination,
            data.shipment.description,
            data.previousBlockHash,
            data.previousShipmentId,
            block.timestamp
        );
    }
    
    function updateShipmentStatus(
        uint256 shipmentId,
        ShipmentStatus status
    ) external onlyAuthorized {
        require(shipmentExists[shipmentId], "Shipment does not exist");
        
        emit ShipmentStatusChanged(
            shipmentId,
            status,
            msg.sender,
            block.timestamp
        );
    }
    
    // Allow receivers to verify their shipments exist
    function verifyShipment(uint256 shipmentId) external view returns (bool) {
        return shipmentExists[shipmentId];
    }
    
    // Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != owner, "New owner same as current owner");
        
        owner = newOwner;
        authorizedProviders[newOwner] = true;
    }
}
