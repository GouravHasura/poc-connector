import { Counter, Registry } from 'prom-client';
import { Configuration } from './configuration';
const fs = require('fs').promises;
const path = require('path');
type State = {
    data: { [key: string]: any[] };
}

export async function tryInitState(configuration: Configuration, registry: Registry): Promise<State> {
    const dataFolder = 'src/data';

    try {
        // Read all files in the data folder
        const files = await fs.readdir(dataFolder);
        const csvFiles = files.filter((file: any) => file.endsWith('.csv'));

        // Use a Map to store the data from each CSV file
        const dataMap = new Map();

        // Read and process each CSV file
        for (const csvFile of csvFiles) {
            const csvFilePath = path.join(dataFolder, csvFile);
            const csvData = await fs.readFile(csvFilePath, 'utf-8');
            const lines = csvData.split('\n');
            const columns = lines.shift()?.split(',') || [];
            const fileData = lines.map((line: any) => {
                const values = line.split(',');
                const obj: { [key: string]: string } = {};
                columns.forEach((column: any, index: any) => {
                    obj[column] = values[index];
                });
                return obj;
            });

            const tableName = path.basename(csvFile, '.csv');
            dataMap.set(tableName, fileData);
        }

        // Convert the Map to an object
        const dataObject: { [key: string]: any[] } = {};
        dataMap.forEach((value, key) => {
            dataObject[key] = value;
        });
        // console.log(dataObject)
        return { data: dataObject };
        
    } catch (error) {
        console.error('Error reading CSV files:', error);
        throw error;
    }
}