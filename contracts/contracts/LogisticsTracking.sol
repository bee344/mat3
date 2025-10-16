// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LogisticsEvents {
    address public owner;

    mapping(address => bool) public authorizedProviders;
    uint256 public nextShipmentId;

    enum ShipmentStage {
        Harvest,
        Drying,
        Grinding,
        Blending,
        Packaging,
        Retail
    }

    constructor() {
        owner = msg.sender;
        authorizedProviders[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: owner only");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedProviders[msg.sender],
            "Not authorized: provider only"
        );
        _;
    }

    struct Location {
        string longitud;
        string latitud;
    }

    struct ShipmentData {
        uint256 weight;
        uint256 price;
        uint256 batch;
        Location origin;
        Location destination;
        string description;
        ShipmentStage stage;
    }

    struct ShipmentUpdateData {
        ShipmentData shipment;
        bytes32 previousBlockHash;
        uint256 previousShipmentId;
    }

    event ShipmentCreated(
        uint256 indexed shipmentId,
        uint256 indexed batch,
        uint256 timestamp,
        ShipmentStage stage
    );

    event ShipmentDetails(
        uint256 indexed shipmentId,
        uint256 weight,
        uint256 price,
        string description
    );

    event ShipmentLocation(
        uint256 indexed shipmentId,
        string originLat,
        string originLong,
        string destLat,
        string destLong
    );

    event ShipmentUpdated(
        uint256 indexed shipmentId,
        uint256 indexed batch,
        uint256 timestamp,
        ShipmentStage stage,
        bytes32 previousBlockHash,
        uint256 previousShipmentId
    );

    event ShipmentUpdateDetails(
        uint256 indexed shipmentId,
        uint256 weight,
        uint256 price,
        string description
    );

    event ShipmentUpdateLocation(
        uint256 indexed shipmentId,
        string originLat,
        string originLong,
        string destLat,
        string destLong
    );

    event ProviderAuthorized(address indexed provider, uint256 timestamp);
    event ProviderRevoked(address indexed provider, uint256 timestamp);

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

    function createShipment(
        ShipmentData calldata data
    ) external onlyAuthorized returns (uint256 id) {
        require(data.weight > 0, "Weight must be greater than 0");
        require(data.price > 0, "Price must be greater than 0");
        require(
            bytes(data.origin.latitud).length > 0,
            "Origin latitude required"
        );
        require(
            bytes(data.origin.longitud).length > 0,
            "Origin longitude required"
        );
        require(
            bytes(data.destination.latitud).length > 0,
            "Destination latitude required"
        );
        require(
            bytes(data.destination.longitud).length > 0,
            "Destination longitude required"
        );

        id = nextShipmentId;
        ++nextShipmentId;

        emit ShipmentCreated(id, data.batch, block.timestamp, data.stage);

        emit ShipmentDetails(id, data.weight, data.price, data.description);

        emit ShipmentLocation(
            id,
            data.origin.latitud,
            data.origin.longitud,
            data.destination.latitud,
            data.destination.longitud
        );

        return id;
    }

    function updateShipment(
        ShipmentUpdateData calldata data
    ) external onlyAuthorized returns (uint256 id) {
        require(data.shipment.weight > 0, "Weight must be greater than 0");
        require(data.shipment.price > 0, "Price must be greater than 0");
        require(
            bytes(data.shipment.origin.latitud).length > 0,
            "Origin latitude required"
        );
        require(
            bytes(data.shipment.origin.longitud).length > 0,
            "Origin longitude required"
        );
        require(
            bytes(data.shipment.destination.latitud).length > 0,
            "Destination latitude required"
        );
        require(
            bytes(data.shipment.destination.longitud).length > 0,
            "Destination longitude required"
        );

        id = nextShipmentId;
        ++nextShipmentId;

        emit ShipmentUpdated(
            id,
            data.shipment.batch,
            block.timestamp,
            data.shipment.stage,
            data.previousBlockHash,
            data.previousShipmentId
        );

        emit ShipmentUpdateDetails(
            id,
            data.shipment.weight,
            data.shipment.price,
            data.shipment.description
        );

        emit ShipmentUpdateLocation(
            id,
            data.shipment.origin.latitud,
            data.shipment.origin.longitud,
            data.shipment.destination.latitud,
            data.shipment.destination.longitud
        );

        return id;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != owner, "New owner same as current owner");

        owner = newOwner;
        authorizedProviders[newOwner] = true;
    }
}
