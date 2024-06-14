import { expect } from "chai";
import {
  ErrorMessages,
  calculateAgeFromDateString,
  extractNames,
  isNull,
} from "../functions";
import { faker } from "@faker-js/faker";
import moment from "moment";

const firstName = faker.person.firstName();
const middleName = faker.person.middleName();
const lastName = faker.person.lastName();

describe("excel-converter", () => {
  describe("convertPerson", () => {
    it("will convert a person correctly", () => {});
  });

  describe("calculateAgeFromDateString", () => {
    it("will calculate the age correctly when both birth date and end date are provided", () => {
      const expectedYearDiff = faker.number.int(50);
      const endDateStr = moment(faker.date.past()).format("MM/DD/YYYY");
      const birthDateStr = moment(endDateStr, "MM/DD/YYYY")
        .subtract(expectedYearDiff, "years")
        .format("MM/DD/YYYY");

      const age = calculateAgeFromDateString(birthDateStr, endDateStr);

      expect(age).to.equal(expectedYearDiff);
    });

    it("will calculate the age correctly when the end date is null, using the current date as the end date", () => {
      const expectedYearDiff = faker.number.int(50);
      const birthDateStr = moment()
        .subtract(expectedYearDiff, "years")
        .format("MM/DD/YYYY");

      const age = calculateAgeFromDateString(birthDateStr, null);

      expect(age).to.equal(expectedYearDiff);
    });

    it("will calculate the age correctly when the month for given end date is less than the month for given birth date", () => {
      const age = calculateAgeFromDateString("02/01/2000", "01/01/2010");
      expect(age).to.equal(9);
    });

    it("will throw an error if date is invalid", () => {
      const ensureLineNotCalled = () => expect(true).to.be.false;

      try {
        calculateAgeFromDateString(
          faker.date.past().toISOString(),
          "01/01/2010"
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
        const nameString = `${firstName} ${middleName} ${lastName}`
        const res = extractNames(nameString);

        expect(res.firstName).to.equal(firstName);
        expect(res.lastName).to.equal(lastName);
    });

    it("will return first and last name given a string with two names", () => {
        const nameString = `${firstName} ${lastName}`
        const res = extractNames(nameString);

        expect(res.firstName).to.equal(firstName);
        expect(res.lastName).to.equal(lastName);
    });

    it("will return last name as an empty string if only one name is present", () => {
        const nameString = `${firstName}`
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

    it("will return true given a falsy value", () => {
      const res = isNull(0);

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
    it("will return no relatives if none are present in the input data", () => {});

    it("will return all relatives that are present in the input data", () => {});
  });
});
