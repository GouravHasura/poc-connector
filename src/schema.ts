import { readFile } from 'fs/promises';
import { resolve, join, basename } from 'path';
import * as fs from 'fs/promises';
import {
    CollectionInfo,
    ObjectField,
    ObjectType,
    ScalarType,
    SchemaResponse
} from "@hasura/ndc-sdk-typescript";

type Configuration = {
    tables: TableConfiguration[];
};

type TableConfiguration = {
    tableName: string;
    filePath: string;
};

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
    const dataFolder = 'src/data';

    // Read all files in the data folder
    const files = await fs.readdir(dataFolder);
    const csvFiles = files.filter((file: any) => file.endsWith('.csv'));

    for (const csvFile of csvFiles) {
        const tableName = basename(csvFile, '.csv');
        const filePath = join(dataFolder, csvFile);
        const columns = await getTableColumns(filePath);

        const fields: { [k: string]: ObjectField } = {};
        for (const column of columns) {
            fields[column] = { type: { type: 'named', name: 'string' } }; // Defaulting to string type
        }

        objectTypes[tableName] = { fields };

        collections.push({
            name: tableName,
            arguments: {},
            type: tableName,
            uniqueness_constraints: {},
            foreign_keys: {}
        });
    }

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
