import { QueryRequest, QueryResponse, RowSet } from "@hasura/ndc-sdk-typescript";
import { Configuration } from "./configuration";

type State = {
    data: { [key: string]: any[] };
}
export async function query(configuration: Configuration, state: State, request: QueryRequest): Promise<QueryResponse> {
    try {
        const table = request.collection;
        const { data } = state;
        const tableData = data[table];
        if (!tableData) {
            throw new Error(`Table '${table}' not found in the data`);
        }

        let fields: any = [];
        if (request.query.fields) {
            fields = Object.keys(request.query.fields);
        } else {
            fields = Object.keys(tableData[0]);
        }

        const limit = request.query.limit || tableData.length;
        const limitedData = tableData.slice(0, limit);

        const rowSets: RowSet[] = [
            {
                rows: limitedData.map(row => {
                    const modifiedRow: { [key: string]: string | null } = {};
                    fields.forEach((field:any) => {
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
