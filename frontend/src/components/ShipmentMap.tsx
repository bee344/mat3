    import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
    import type { LatLngTuple } from 'leaflet';

    type ShipmentMapProps = {
    origin: LatLngTuple;
    destination: LatLngTuple;
    waypoints?: LatLngTuple[];
    };

    export function ShipmentMap({ origin, destination, waypoints = [] }: ShipmentMapProps) {
    const route: LatLngTuple[] = [origin, ...waypoints, destination];

    const average = (arr: LatLngTuple[]) => [
        arr.reduce((sum, p) => sum + p[0], 0) / arr.length,
        arr.reduce((sum, p) => sum + p[1], 0) / arr.length,
    ] as LatLngTuple;

    const center = average(route);

    return (
        <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
        >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Marker position={origin}>
            <Popup>Origin</Popup>
        </Marker>

        {waypoints.map((point, index) => (
            <Marker key={`waypoint-${index}`} position={point}>
            <Popup>Waypoint {index + 1}</Popup>
            </Marker>
        ))}

        <Marker position={destination}>
            <Popup>Destination</Popup>
        </Marker>

        <Polyline positions={route} color="blue" />
        </MapContainer>
    );
    }
