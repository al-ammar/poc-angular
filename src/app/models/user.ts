import { BaseModel } from "./BaseModel";


export class User extends BaseModel{
    userName?: string;
    password?: string;
    lastName?:string;
    firstName?:string;
    pieces?: Document[];
    content?:BlobPart;
    url?: any;
}

export class Document {
    name?: string;
    data?: any;
}