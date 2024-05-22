import { QueryRequest, QueryResponse, RowSet } from "@hasura/ndc-sdk-typescript";
import { Configuration } from "./configuration";

type State = {
    data: { [key: string]: any[] };
}
export async function query(configuration: Configuration, state: State, request: QueryRequest): Promise<QueryResponse> {
    try {
        const table = request.collection;
        const { data } = state;

        if (!data.hasOwnProperty(table)) {
            throw new Error(`Table '${table}' not found in the data`);
        }

        const tableData = data[table];
        if (!tableData || tableData.length === 0) {
            throw new Error(`No data found for table '${table}'`);
        }

        // Extract the fields requested in the query
        let fields: string[] = [];
        if (request.query.fields) {
            fields = Object.keys(request.query.fields).map(field => field.split('_')[0]); // Extract base field names
        } else {
            // If no specific fields are requested, use all fields from the first row
            fields = Object.keys(tableData[0]);
        }
        console.log(fields)
        // Check if all requested fields exist in the table's columns
        const tableColumns = Object.keys(tableData[0]);
        console.log('Table columns:', tableColumns); // Log the table columns
        const invalidFields = fields.filter(field => !tableColumns.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields requested: ${invalidFields.join(', ')}`);
        }
        
        

        // Process the data and apply any requested limit
        const limit = request.query.limit || tableData.length;
        const limitedData = tableData.slice(0, limit);

        // Map the data to the required format, converting 'NULL' strings to null
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

        return rowSets;
    } catch (error) {
        console.error('Query error:', error);
        throw new Error("Internal server error");
    }
}

