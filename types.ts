export interface IOriginalPerson {
    Name: string;
    Birthday: string;
    Died?: string;
    Father?: string;
    Mother?: string;
    Brother?: string;
    Sister?: string;
}

export interface IConvertedPerson {
    firstName: string;
    lastName: string;
    birthday: string;
    age: number;
    relatives?: IRelative[];
}

export interface IRelative {
    firstName: string;
    lastName: string;
    relationship: string;
}

export interface IName {
    firstName: string;
    lastName: string;
}