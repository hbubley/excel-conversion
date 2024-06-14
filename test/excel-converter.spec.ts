import { expect } from 'chai';
import { convertPerson } from '../src/excel-converter';
import { IOriginalPerson } from '../src/types';

describe('excel-converter', () => {
    describe('convertPerson', () => {
        it('will convert a person correctly', () => {
        });
        it('will pass value for Died into calculateAge if one exists', () => {
        });
      
        it('will pass value for today into calculateAge if Died does not exist', () => {
        });
    });

    describe('calculateAge', () => {
        it('will calculate age correctly for sendDate with month less than current month', () => {
        });

        it('will calculate age correctly for endDate with month greater than current month', () => {
        });
    });

    describe('extractNames', () => {
        it('will return first and last name given a string with three names', () => {
        });

        it('will return first and last name given a string with two names', () => {
        });

        it('will return last name as an empty string if only one name is present', () => {
        });
    });

    describe('isNull', () => {
        it('will return true given the value "null"', () => {
        });

        it('will return true given a falsy value', () => {
        });

        it('will return true given a defined value that is not "null"', () => {
        });
    });

    describe('getRelatives', () => {
        it('will return no relatives if none are present in the input data', () => {
        });

        it('will return all relatives that are present in the input data', () => {
        });
    });
});
