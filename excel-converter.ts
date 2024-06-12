import fs from 'fs';
import csvToJson from 'convert-csv-to-json';
import { IConvertedPerson, IName, IOriginalPerson, IRelative } from './types';

const inputFile = 'input.csv';
const outputFile = 'output.json';
const possibleRelatives: (keyof IOriginalPerson)[] = ["Father", "Mother", "Brother", "Sister"]

const originalPeople: IOriginalPerson[] = csvToJson.fieldDelimiter(',').getJsonFromCsv(inputFile);

const convertedPeople: IConvertedPerson[] = originalPeople.map((originalPerson) => convertPerson(originalPerson));

writeDataToJson(convertedPeople, outputFile);

function convertPerson(originalPerson: IOriginalPerson): IConvertedPerson {
    const nameObject = splitFullName(originalPerson.Name);
    const birthDate = new Date(originalPerson.Birthday);
    const age = calculateAgeBasedOnBirthDate(birthDate);
    const relatives: IRelative[] = [];

    possibleRelatives.forEach(relative => {
        if (originalPerson[relative] && originalPerson[relative] !== "null") {
            const relativeNameObject = splitFullName(originalPerson[relative] ?? "");
            relatives.push({ ...relativeNameObject, relationship: relative });
        }
    });

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
    const nameObject = { firstName: splitName[0], lastName: splitName[2] ? splitName[2] : splitName[1] };

    return nameObject;
}

function writeDataToJson(data: any, filePath: string): void {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData);
}