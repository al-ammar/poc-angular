export class BaseModel {
    id?: string;
    expand?:boolean = true;
    disabled?: boolean = true;
    checked?:boolean = true;
    description?:string;
    creationDate?:Date;
    updateDate?:Date;
    total?:number;
} 