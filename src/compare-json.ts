import { areJsonEqual, readJsonFile } from "@/utils/functions";
import { JSONComparisonMessages, Paths } from "@/utils/constants";

async function main(file1: string, file2: string): Promise<void> {
  const json1 = await readJsonFile(file1);
  const json2 = await readJsonFile(file2);
 
  if (areJsonEqual(json1, json2)) {
    console.log(JSONComparisonMessages.IDENTICAL);
  } else {
    console.log(JSONComparisonMessages.DIFFERENT);
  }
}

main(Paths.DESIRED_RESULT, Paths.RESULT_OUTPUT);

