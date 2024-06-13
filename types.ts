export interface IOriginalPerson {
    Name: string;
    Birthday: string;
    Died?: string;
    Father?: string;
    Mother?: string;
    Brother?: string;
    Sister?: string;
}

export interface IName {
    firstName: string;
    lastName: string;
}

export interface IConvertedPerson extends IName{
    birthday: string;
    age: number;
    relatives?: IRelative[];
}

export interface IRelative extends IName {
    relationship: string;
}
