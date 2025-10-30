/**
 * Counter Model
 * Collection: counters
 * 
 * Stores atomic counters for auto-incrementing IDs
 */

export const CounterSchema = {
  count: 'number',                  // Current count value
  lastUpdated: 'timestamp',         // Last update timestamp
};

/**
 * Counter Documents
 */
export const Counters = {
  receipts: 'counters/receipts',    // Receipt number counter
  members: 'counters/members',      // Member count
};

/**
 * Example Counter Document
 */
export const CounterExample = {
  count: 425,
  lastUpdated: new Date(),
};
