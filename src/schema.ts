import { Configuration } from "./configuration";
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import {

    CollectionInfo,
    ObjectField,
    ObjectType,
    ScalarType,
    SchemaResponse,
    start
} from "@hasura/ndc-sdk-typescript";

// export async function getSchema(configuration: Configuration): Promise<SchemaResponse> {
//     const scalarTypes: { [k: string]: ScalarType } = {
//         'integer': {
//             aggregate_functions: {},
//             comparison_operators: {
//                 'eq': { type: 'equal' }
//             }
//         },
//         'string': {
//             aggregate_functions: {},
//             comparison_operators: {
//                 'eq': { type: 'equal' },
//                 'like': { type: 'custom', argument_type: { type: 'named', name: 'string' } }
//             }
//         }
//     };

//     const objectTypes: { [k: string]: ObjectType } = {};
//     const collections: CollectionInfo[] = [];
//     configuration.tables.forEach(table => {
//         const tableName = table.tableName;
//         const fields: { [k: string]: ObjectField } = {
//             userId: { type: { type: "named", name: "integer" } },
//             username: { type: { type: "named", name: "string" } },
//             email: { type: { type: "named", name: "string" } },
//             encPassword: { type: { type: "named", name: "string" } },
//             team: { type: { type: "named", name: "integer" } },
//             empManager: { type: { type: "named", name: "integer" } }
//         };

//         // Add object type for the table
//         objectTypes[tableName] = { fields };

//         // Add collection info for the table
//         collections.push({
//             name: tableName,
//             arguments: {},
//             type: tableName,
//             uniqueness_constraints: {},
//             foreign_keys: {}
//         });
//     });
//     console.log(collections)
//     const functions: any[] = [];
//     const procedures: any[] = [];

//     return {
//         scalar_types: scalarTypes,
//         object_types: objectTypes,
//         collections: collections,
//         functions: functions,
//         procedures: procedures
//     };
// }


async function getTableColumns(filePath: string): Promise<string[]> {
    const csvData = await readFile(filePath, 'utf-8');
    const lines = csvData.split('\n');
    const columns = lines[0].split(',').map(column => column.trim());
    return columns;
}

export async function getSchema(configuration: Configuration): Promise<SchemaResponse> {
    const scalarTypes: { [k: string]: ScalarType } = {
        'integer': {
            aggregate_functions: {},
            comparison_operators: {
                'eq': { type: 'equal' }
            }
        },
        'string': {
            aggregate_functions: {},
            comparison_operators: {
                'eq': { type: 'equal' },
                'like': { type: 'custom', argument_type: { type: 'named', name: 'string' } }
            }
        }
    };

    const objectTypes: { [k: string]: ObjectType } = {};
    const collections: CollectionInfo[] = [];

    for (const table of configuration.tables) {
        const tableName = table.tableName;
        const filePath = resolve(table.filePath);
        const columns = await getTableColumns(filePath);

        const fields: { [k: string]: ObjectField } = {};
        for (const column of columns) {
            fields[column] = { type: { type: 'named', name: 'string' } }; // Defaulting to string type
        }

        // Add object type for the table
        objectTypes[tableName] = { fields };

        // Add collection info for the table
        collections.push({
            name: tableName,
            arguments: {},
            type: tableName,
            uniqueness_constraints: {},
            foreign_keys: {}
        });
    }
    console.log(collections)
    const functions: any[] = [];
    const procedures: any[] = [];

    return {
        scalar_types: scalarTypes,
        object_types: objectTypes,
        collections: collections,
        functions: functions,
        procedures: procedures
    };
}
