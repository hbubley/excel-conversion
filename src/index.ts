import csvToJson from "convert-csv-to-json";
import { IConvertedPerson, IOriginalPerson } from "@/utils/types";
import { convertPerson, writeDataToJson } from "@/utils/functions";
import { Paths } from "@/utils/constants";

function main(inputFilePath: string, outputFilePath: string): void {
  const originalPeople: IOriginalPerson[] = csvToJson
    .fieldDelimiter(",")
    .getJsonFromCsv(inputFilePath);
  const convertedPeople: IConvertedPerson[] = originalPeople.map(
    (originalPerson) => convertPerson(originalPerson)
  );

  writeDataToJson(convertedPeople, outputFilePath);
}

main(Paths.INPUT, Paths.RESULT_OUTPUT);
