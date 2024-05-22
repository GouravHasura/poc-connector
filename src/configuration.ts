import { ObjectType } from "@hasura/ndc-sdk-typescript";


export type ObjectTypes = {
    [objectTypeName: string]: ObjectType
  }
  
type TableConfiguration = {
    tableName: string;
    columns: { [k: string]: Column };
    foreignKeys: { [k: string]: ForeignKey };
    filePath: string;
};

type Column = {
    type: string;
};

export type Configuration = {
    filename: string,
    tables: TableConfiguration[];
    objectTypes: ObjectTypes,
};

type ForeignKey = {
    targetTable: string,
    columns: { [k: string]: string };
};
