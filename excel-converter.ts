import fs from 'fs';
import csvToJson from 'convert-csv-to-json';
import { IConvertedPerson, IName, IOriginalPerson, IRelative } from './types';

enum PossibleRelatives {
    Father = "Father",
    Mother = "Mother",
    Brother = "Brother",
    Sister = "Sister"
}

function main(inputFilePath: string, outputFilePath: string): void {
    try {
        const originalPeople: IOriginalPerson[] = csvToJson.fieldDelimiter(',').getJsonFromCsv(inputFilePath);
        const convertedPeople: IConvertedPerson[] = originalPeople.map((originalPerson) => convertPerson(originalPerson));
        writeDataToJson(convertedPeople, outputFilePath);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

function convertPerson(originalPerson: IOriginalPerson): IConvertedPerson {
    const nameObject = splitFullName(originalPerson.Name);
    const birthDate = new Date(originalPerson.Birthday);
    const endDate = originalPerson.Died && originalPerson.Died !== "null" ? new Date(originalPerson.Died) : new Date();
    const age = calculateAge(birthDate, endDate);
    const relatives = getRelatives(originalPerson);
    
    return {
        ...nameObject,
        birthday: birthDate.toISOString().split('T')[0],
        age,
        relatives
    };
}

function calculateAge(birthDate: Date, endDate: Date): number {
    const endYear = endDate.getFullYear();
    let age = endYear - birthDate.getFullYear();

    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    const dayDiff = endDate.getDate() - birthDate.getDate();
    const hasNotReachedCurrentBirthday = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) && endYear === new Date().getFullYear();

    if (hasNotReachedCurrentBirthday) {
        age--;
    }

    return age;
}

function splitFullName(fullName: string): IName {
    const splitName = fullName.split(" ");

    return { firstName: splitName[0], lastName: splitName.pop() ?? "" };
}

function getRelatives(originalPerson: IOriginalPerson): IRelative[] {
    return Object.values(PossibleRelatives)
        .filter((relative) => originalPerson[relative] && originalPerson[relative] !== "null")
        .map((relative) => {
            const relativeNameObject = splitFullName(originalPerson[relative] as string);
            return { ...relativeNameObject, relationship: relative };
        });
}

function writeDataToJson(data: any, filePath: string): void {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData);
}

main('input.csv', 'output.json');