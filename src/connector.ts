import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { getSchema } from "./schema";
import { Configuration } from "./configuration";
import { tryInitState } from "./state";
import { query } from './query';
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

