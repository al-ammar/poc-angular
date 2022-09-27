import { BaseModel } from "./BaseModel";


export class User extends BaseModel{
    userName?: string;
    password?: string;
}