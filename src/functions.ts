import fs from "fs";
import moment from "moment";
import { IConvertedPerson, IName, IOriginalPerson, IRelative } from "@/types";

export enum PossibleRelatives {
  FATHER = "Father",
  MOTHER = "Mother",
  BROTHER = "Brother",
  SISTER = "Sister",
}

export enum ErrorMessages {
  INVALID_DATE_FORMAT = "Invalid date format",
}

export function convertPerson(
  originalPerson: IOriginalPerson
): IConvertedPerson {
  const nameObject = extractNames(originalPerson.Name);
  const age = calculateAgeFromDateString(
    originalPerson.Birthday,
    originalPerson.Died ?? null
  );
  const relatives = getRelatives(originalPerson);

  return {
    ...nameObject,
    birthday: moment(originalPerson.Birthday, "MM/DD/YYYY").format(
      "YYYY-MM-DD"
    ),
    age,
    relatives,
  };
}

export function calculateAgeFromDateString(
  birthDateStr: string,
  endDateStr: string | null
): number {
  const birthDate = moment(birthDateStr, "MM/DD/YYYY");
  const endDate = isNull(endDateStr)
    ? moment()
    : moment(endDateStr, "MM/DD/YYYY");

  if (!birthDate.isValid() || !endDate.isValid()) {
    throw new Error(ErrorMessages.INVALID_DATE_FORMAT);
  }

  return moment(endDate).diff(birthDate, "years", false);
}

export function extractNames(fullName: string): IName {
  const splitName = fullName.split(" ");

  return {
    firstName: splitName[0],
    lastName: splitName.length > 1 ? splitName.pop() ?? "" : "",
  };
}

export function getRelatives(originalPerson: IOriginalPerson): IRelative[] {
  return Object.values(PossibleRelatives)
    .filter((relative) => !isNull(originalPerson[relative]))
    .map((relative) => {
      const relativeNameObject = extractNames(
        originalPerson[relative] as string
      );
      return { ...relativeNameObject, relationship: relative };
    });
}

export function isNull(field: any): boolean {
  return field && field !== "null" ? false : true;
}

export function writeDataToJson(data: any, filePath: string): void {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, jsonData);
}
