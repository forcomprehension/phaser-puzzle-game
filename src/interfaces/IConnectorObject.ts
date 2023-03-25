

/**
 * Gameobject which connects other entities and handles connection data
 */
export interface IConnectorObject {
    connect(): void;
    disconnect(): void;
}
