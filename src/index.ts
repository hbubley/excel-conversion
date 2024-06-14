import csvToJson from "convert-csv-to-json";
import { IConvertedPerson, IOriginalPerson } from "@/types";
import { convertPerson, writeDataToJson } from "./functions";

function main(inputFilePath: string, outputFilePath: string): void {
  const originalPeople: IOriginalPerson[] = csvToJson
    .fieldDelimiter(",")
    .getJsonFromCsv(inputFilePath);
  const convertedPeople: IConvertedPerson[] = originalPeople.map(
    (originalPerson) => convertPerson(originalPerson)
  );

  writeDataToJson(convertedPeople, outputFilePath);
}

main("./input.csv", "./output.json");
