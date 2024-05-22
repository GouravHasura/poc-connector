import { QueryRequest, QueryResponse, RowSet } from "@hasura/ndc-sdk-typescript";
import { Configuration } from "./configuration";

type State = {
    data: { [key: string]: any[] };
}
export async function query(configuration: Configuration, state: State, request: QueryRequest): Promise<QueryResponse> {
    try {
        const table = request.collection;
        const { data } = state;

        console.log(`Querying table: ${table}`);

        if (!data.hasOwnProperty(table)) {
            throw new Error(`Table '${table}' not found in the data`);
        }

        const tableData = data[table];
        if (!tableData || tableData.length === 0) {
            throw new Error(`No data found for table '${table}'`);
        }

        console.log(`Data found for table: ${table}`, tableData);

        let fields: string[] = [];
        if (request.query.fields) {
            fields = Object.keys(request.query.fields);
        } else {
            fields = Object.keys(tableData[0]);
        }

        console.log(`Fields to be queried: ${fields}`);

        const limit = request.query.limit || tableData.length;
        const limitedData = tableData.slice(0, limit);

        console.log(`Applying limit: ${limit}, Data:`, limitedData);

        const rowSets: RowSet[] = [
            {
                rows: limitedData.map(row => {
                    const modifiedRow: { [key: string]: string | null } = {};
                    fields.forEach(field => {
                        modifiedRow[field] = row[field] === 'NULL' ? null : row[field];
                    });
                    return modifiedRow;
                })
            }
        ];

        console.log(`RowSets:`, rowSets);

        return rowSets;
    } catch (error) {
        console.error('Query error:', error);
        throw new Error("Internal server error");
    }
}

