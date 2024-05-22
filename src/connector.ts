import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { getSchema } from "./schema";
import { Configuration } from "./configuration";
import { tryInitState } from "./state";
import {
    BadGateway,
    BadRequest,
    CapabilitiesResponse,
    CollectionInfo,
    ComparisonTarget,
    ComparisonValue,
    Connector,
    ConnectorError,
    ExplainResponse,
    Expression,
    ForeignKeyConstraint,
    InternalServerError,
    MutationRequest,
    MutationResponse,
    NotSupported,
    ObjectField,
    ObjectType,
    OrderByElement,
    Query,
    QueryRequest,
    QueryResponse,
    Relationship,
    RowFieldValue,
    ScalarType,
    SchemaResponse,
    start
} from "@hasura/ndc-sdk-typescript";

type State = {
    data: { [key: string]: any[] };
}

function getCapabilities(configuration: Configuration): CapabilitiesResponse {
    return {
        version: "0.1.2",
        capabilities: {
            query: {},
            mutation: {},
        }
    }
}

async function parseConfiguration(configurationDir: string): Promise<Configuration> {
    const configuration_file = resolve(configurationDir, 'configuration.json');
    const configuration_data = await readFile(configuration_file);
    const configuration = JSON.parse(configuration_data.toString());
    return {
        ...configuration
    };
    // throw new Error("Function not implemented.");
}

export const connector: Connector<Configuration, State> = {
    parseConfiguration,
    getCapabilities,
    tryInitState,
    fetchMetrics,
    healthCheck,
    getSchema,
    queryExplain,
    mutationExplain,
    mutation,
    query


}

async function fetchMetrics(configuration: Configuration, state: State): Promise<undefined> {
}

async function healthCheck(configuration: Configuration, state: State): Promise<undefined> {
    // try {
    //     await state.db.all("SELECT 1");
    // } catch (x) {
    //     throw new ConnectorError(503, "Service Unavailable");
    // }
    throw new Error("Function not implemented.");
}


async function queryExplain(configuration: Configuration, state: State, request: QueryRequest): Promise<ExplainResponse> {
    throw new Error("Function not implemented.");
}

async function mutationExplain(configuration: Configuration, state: State, request: MutationRequest): Promise<ExplainResponse> {
    throw new Error("Function not implemented.");
}

async function mutation(configuration: Configuration, state: State, request: MutationRequest): Promise<MutationResponse> {
    throw new Error("Function not implemented.");
}

async function query(configuration: Configuration, state: State, request: QueryRequest): Promise<QueryResponse> {
    try {
        // console.log(request)
        // const table = request.collection;
        // const { data } = state;

        // const tableIndex = configuration.tables.findIndex(t => t.tableName === table);
        // // console.log('data',data)
        // // if (tableIndex === -1) {
        // //     // Table not found
        // //     return {
        // //         error: `Table '${table}' not found in the configuration`
        // //     };
        // // }

        // let fields: any = [];
        // if (request.query.fields) {
        //     fields = Object.keys(request.query.fields);
        // }

        
        // const tableData = data;
        // const responseData = tableData;
        
        // const limit = request.query.limit || responseData.length;
        // const limitedData = responseData.slice(0, limit);


        // const rowSets = {
        //     rows: limitedData.map(row => {
        //       const modifiedRow: {[key: string]: string | null} = {}; 
        //       Object.keys(row).forEach((key:any) => {
        //         modifiedRow[key] = row[key] === 'NULL' ? null : row[key]; 
        //       });
        //       return modifiedRow;
        //     })
        //   };
         
        // return [rowSets] ;
       // console.log('request',request)
         throw new Error("Internal serversasas error");

    } catch (error) {
        console.error('Query error:', error);
        // Throw the error instead of returning an error object
        throw new Error("Internal serversasas error");
    }

}
