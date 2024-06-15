import fs from "fs";
import moment from "moment";
import {
  IConvertedPerson,
  IName,
  IOriginalPerson,
  IRelative,
} from "@/utils/types";
import {
  ErrorMessages,
  ExpectedDateFormat,
  PossibleRelatives,
} from "@/utils/constants";

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
    birthday: moment(originalPerson.Birthday, ExpectedDateFormat).format(
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
  const birthDate = moment(birthDateStr, ExpectedDateFormat);
  const endDate = isNull(endDateStr)
    ? moment()
    : moment(endDateStr, ExpectedDateFormat);

  if (!birthDate.isValid() || !endDate.isValid()) {
    throw new Error(ErrorMessages.INVALID_DATE_FORMAT);
  }

  return moment(endDate).diff(birthDate, "years", false);
}

export function extractNames(fullName: string): IName {
  const [firstName, ...remainderOfName] = fullName.split(" ");

  return {
    firstName: firstName,
    lastName: remainderOfName.pop() ?? "",
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

export function isNull(field: unknown): boolean {
  return field === undefined || field == null || field === "null";
}

export function writeDataToJson(data: any, filePath: string): void {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, jsonData);
}

export async function readJsonFile(filePath: string): Promise<any> {
  const data = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export function areJsonEqual(json1: any, json2: any): boolean {
  return JSON.stringify(json1) === JSON.stringify(json2);
}

