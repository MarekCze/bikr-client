# Table: maintenance_records

Stores records of maintenance activities performed on motorcycles.

## Columns

| Name          | Type                        | Modifiers                   | Description                                                                                             |
| :------------ | :-------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`          | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the maintenance record.                                                           |
| `motorcycle_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `motorcycles` table this record belongs to.                                 |
| `user_id`     | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (owner of the record).                                        |
| `record_type` | `text`                      | `NOT NULL`                  | Type of maintenance (service, repair, upgrade, inspection, oil_change, tire_change, other).             |
| `title`       | `text`                      | `NOT NULL`                  | User-defined title for the maintenance record (e.g., "6000 Mile Service", "Replaced Front Tire").       |
| `description` | `text`                      |                             | Optional detailed description of the work performed.                                                    |
| `date`        | `date`                      | `NOT NULL`                  | Date when the maintenance was performed.                                                                |
| `odometer`    | `integer`                   |                             | Optional odometer reading at the time of maintenance.                                                   |
| `cost`        | `numeric(10,2)`             |                             | Optional total cost of the maintenance.                                                                 |
| `location`    | `text`                      |                             | Optional location where the maintenance was performed (e.g., "Dealer", "Home Garage").                  |
| `performed_by`| `text`                      |                             | Optional name of the person or shop that performed the maintenance.                                     |
| `created_at`  | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the record was created.                                                                  |
| `updated_at`  | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the record was last updated.                                                             |

## Constraints

- **maintenance_records_pkey**: Primary key constraint on the `id` column.
- **maintenance_records_record_type_check**: Check constraint ensuring `record_type` is one of the allowed values ('service', 'repair', 'upgrade', 'inspection', 'oil_change', 'tire_change', 'other').
- **maintenance_records_motorcycle_id_fkey**: Foreign key constraint referencing `motorcycles(id)`.
- **maintenance_records_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `maintenance_records_pkey` (implicit index for PRIMARY KEY)
- `maintenance_records_motorcycle_id_idx`: Index on the `motorcycle_id` column.
- `maintenance_records_user_id_idx`: Index on the `user_id` column.

## Referenced By

*   `maintenance_parts` (`maintenance_record_id`)

## Row Level Security (RLS)

- **Users can manage own maintenance records**: Allows INSERT, UPDATE, DELETE if the current user is the owner (`user_id`).
- **Users can see own maintenance records**: Allows SELECT if the current user is the owner (`user_id`).
- RLS is enabled for this table.
