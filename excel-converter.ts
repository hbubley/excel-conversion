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
    const age = calculateAgeBasedOnBirthDate(birthDate);
    const relatives: IRelative[] = [];

    for (const relative of Object.values(PossibleRelatives)) {
        if (originalPerson[relative] && originalPerson[relative] !== "null") {
            const relativeNameObject = splitFullName(originalPerson[relative] as string);
            relatives.push({ ...relativeNameObject, relationship: relative });
        }
    }

    return {
        ...nameObject,
        birthday: birthDate.toISOString().split('T')[0],
        age,
        relatives
    };
}

function calculateAgeBasedOnBirthDate(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const hasNotReachedCurrentBirthday = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate());

    if (hasNotReachedCurrentBirthday) {
        age--;
    }

    return age;
}

function splitFullName(fullName: string): IName {
    const splitName = fullName.split(" ")
    const lastArrayElement = splitName.length - 1
    const nameObject = { firstName: splitName[0], lastName: splitName[lastArrayElement] };

    return nameObject;
}

function writeDataToJson(data: any, filePath: string): void {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData);
}

main('input.csv', 'output.json');