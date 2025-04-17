# Table: maintenance_parts

Stores details about specific parts used in a maintenance record.

## Columns

| Name                    | Type                        | Modifiers                   | Description                                                                 |
| :---------------------- | :-------------------------- | :-------------------------- | :-------------------------------------------------------------------------- |
| `id`                    | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the maintenance part record.                          |
| `maintenance_record_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `maintenance_records` table this part belongs to. |
| `part_name`             | `text`                      | `NOT NULL`                  | Name of the part used (e.g., "Oil Filter", "Spark Plug").                   |
| `part_number`           | `text`                      |                             | Optional manufacturer part number.                                          |
| `quantity`              | `integer`                   | `NOT NULL`, `DEFAULT 1`     | Quantity of the part used.                                                  |
| `cost`                  | `numeric(10,2)`             |                             | Optional cost of the part(s).                                               |
| `created_at`            | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the part record was created.                                 |

## Constraints

- **maintenance_parts_pkey**: Primary key constraint on the `id` column.
- **maintenance_parts_maintenance_record_id_fkey**: Foreign key constraint referencing `maintenance_records(id)`.

## Indexes

- `maintenance_parts_pkey` (implicit index for PRIMARY KEY)

## Referenced By

*   None

## Row Level Security (RLS)

- **Users can manage parts through maintenance records**: Allows INSERT, UPDATE, DELETE if the user owns the associated `maintenance_record`.
- **Users can see own maintenance parts**: Allows SELECT if the user owns the associated `maintenance_record`.
- RLS is enabled for this table.
