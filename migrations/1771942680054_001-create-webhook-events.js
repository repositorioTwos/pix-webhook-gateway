/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createExtension('pgcrypto', { ifNotExists: true })

  pgm.createTable('webhook_events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    provider: { type: 'varchar(50)', notNull: true },
    event_type: { type: 'varchar(100)', notNull: true },
    external_id: { type: 'varchar(150)', notNull: true },
    payload: { type: 'jsonb', notNull: true },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending'
    },
    attempts: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    processed_at: { type: 'timestamp' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    }
  })
}

export const down = (pgm) => {
  pgm.dropTable('webhook_events')
}