import { expect } from "chai";
import {
  areJsonEqual,
  calculateAgeFromDateString,
  convertPerson,
  extractNames,
  getRelatives,
  isNull,
} from "@/utils/functions";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { IConvertedPerson, IOriginalPerson } from "@/utils/types";
import {
  ErrorMessages,
  ExpectedDateFormat,
  PossibleRelatives,
} from "@/utils/constants";

const firstName = faker.person.firstName();
const middleName = faker.person.middleName();
const lastName = faker.person.lastName();

const fatherFirstName = faker.person.firstName();
const fatherMiddleName = faker.person.middleName();
const fatherLastName = faker.person.lastName();

const motherFirstName = faker.person.firstName();
const motherMiddleName = faker.person.middleName();
const motherLastName = faker.person.lastName();

const brotherFirstName = faker.person.firstName();
const brotherLastName = faker.person.lastName();

const sisterFirstName = faker.person.firstName();

const expectedYearDiff = faker.number.int(50);
const endDateStr = moment(faker.date.past(), ExpectedDateFormat).format(
  ExpectedDateFormat
);
const birthDateStr = moment(endDateStr, ExpectedDateFormat)
  .subtract(expectedYearDiff, "years")
  .format(ExpectedDateFormat);

const convertedBirthDateStr = moment(birthDateStr, ExpectedDateFormat).format(
  "YYYY-MM-DD"
);

const originalPersonWithRelatives: IOriginalPerson = {
  Name: `${firstName} ${middleName} ${lastName}`,
  Birthday: birthDateStr,
  Died: endDateStr,
  Father: `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`,
  Mother: `${motherFirstName} ${motherMiddleName} ${motherLastName}`,
  Brother: `${brotherFirstName} ${brotherLastName}`,
  Sister: `${sisterFirstName}`,
};

const originalPersonWithoutRelatives: IOriginalPerson = {
  Name: `${firstName} ${middleName} ${lastName}`,
  Birthday: birthDateStr,
  Died: endDateStr,
  Father: "null",
  Mother: "null",
};

const originalPersonWithPartialRelatives: IOriginalPerson = {
  Name: `${firstName} ${middleName} ${lastName}`,
  Birthday: birthDateStr,
  Died: endDateStr,
  Father: `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`,
  Brother: "null",
  Sister: `${sisterFirstName}`,
};

const convertedPersonWithRelatives: IConvertedPerson = {
  firstName,
  lastName,
  birthday: convertedBirthDateStr,
  age: expectedYearDiff,
  relatives: [
    {
      firstName: fatherFirstName,
      lastName: fatherLastName,
      relationship: PossibleRelatives.FATHER,
    },
    {
      firstName: motherFirstName,
      lastName: motherLastName,
      relationship: PossibleRelatives.MOTHER,
    },
    {
      firstName: brotherFirstName,
      lastName: brotherLastName,
      relationship: PossibleRelatives.BROTHER,
    },
    {
      firstName: sisterFirstName,
      lastName: "",
      relationship: PossibleRelatives.SISTER,
    },
  ],
};

const convertedPersonWithoutRelatives: IConvertedPerson = {
  firstName,
  lastName,
  birthday: convertedBirthDateStr,
  age: expectedYearDiff,
  relatives: [],
};

const convertedPersonWithPartialRelatives: IConvertedPerson = {
  firstName,
  lastName,
  birthday: convertedBirthDateStr,
  age: expectedYearDiff,
  relatives: [
    {
      firstName: fatherFirstName,
      lastName: fatherLastName,
      relationship: PossibleRelatives.FATHER,
    },
    {
      firstName: sisterFirstName,
      lastName: "",
      relationship: PossibleRelatives.SISTER,
    },
  ],
};

describe("excel-converter", () => {
  describe("convertPerson", () => {
    it("will convert a person's data into the expected format", () => {
      const res = convertPerson(originalPersonWithRelatives);

      expect(res).to.deep.equal(convertedPersonWithRelatives);
    });
  });

  describe("calculateAgeFromDateString", () => {
    it("will calculate the age correctly when both birth date and end date are provided", () => {
      const age = calculateAgeFromDateString(birthDateStr, endDateStr);

      expect(age).to.equal(expectedYearDiff);
    });

    it("will calculate the age correctly when the end date is null, using the current date as the end date", () => {
      const birthDateStr = moment()
        .subtract(expectedYearDiff, "years")
        .format(ExpectedDateFormat);

      const age = calculateAgeFromDateString(birthDateStr, null);

      expect(age).to.equal(expectedYearDiff);
    });

    it("will calculate the age correctly when the month for given end date is less than the month for given birth date", () => {
      const age = calculateAgeFromDateString("02/01/2000", "01/01/2010");
      expect(age).to.equal(9);
    });

    it("will throw an error if date is invalid format", () => {
      const ensureLineNotCalled = () => expect(true).to.be.false;

      try {
        calculateAgeFromDateString(
          faker.date.past().toISOString(),
          birthDateStr
        );
        ensureLineNotCalled();
      } catch (error: any) {
        expect(error).to.exist;
        expect(error.message).to.equal(ErrorMessages.INVALID_DATE_FORMAT);
      }
    });
  });

  describe("extractNames", () => {
    it("will return first and last name given a string with three names", () => {
      const nameString = `${firstName} ${middleName} ${lastName}`;
      const res = extractNames(nameString);

      expect(res.firstName).to.equal(firstName);
      expect(res.lastName).to.equal(lastName);
    });

    it("will return first and last name given a string with two names", () => {
      const nameString = `${firstName} ${lastName}`;
      const res = extractNames(nameString);

      expect(res.firstName).to.equal(firstName);
      expect(res.lastName).to.equal(lastName);
    });

    it("will return last name as an empty string if only one name is present", () => {
      const nameString = `${firstName}`;
      const res = extractNames(nameString);

      expect(res.firstName).to.equal(firstName);
      expect(res.lastName).to.equal("");
    });
  });

  describe("isNull", () => {
    it('will return true given the value "null"', () => {
      const res = isNull("null");

      expect(res).to.be.true;
    });

    it("will return true given an undefined value", () => {
      const res = isNull(undefined);

      expect(res).to.be.true;
    });

    it('will return false given a defined value that is not "null"', () => {
      const res = isNull(faker.animal.bear());

      expect(res).to.be.false;
    });
  });

  describe("getRelatives", () => {
    it("will return an empty array for relatives if none are present in the input data", () => {
      const res = getRelatives(originalPersonWithoutRelatives);

      expect(res).to.deep.equal(convertedPersonWithoutRelatives.relatives);
    });

    it("will return all relatives if they are present in the input data", () => {
      const res = getRelatives(originalPersonWithRelatives);

      expect(res).to.deep.equal(convertedPersonWithRelatives.relatives);
    });

    it("will return only the relatives that are present in the input data", () => {
      const res = getRelatives(originalPersonWithPartialRelatives);

      expect(res).to.deep.equal(convertedPersonWithPartialRelatives.relatives);
    });
  });

  describe("areJsonEqual", () => {
    it("will return true if JSON contents match", () => {
      const res = areJsonEqual(originalPersonWithRelatives, originalPersonWithRelatives);

      expect(res).to.be.true;
    });

    it("will return false if JSON contents do not match", () => {
      const res = areJsonEqual(originalPersonWithRelatives, convertedPersonWithRelatives);

      expect(res).to.be.false;
    });
  });
});
