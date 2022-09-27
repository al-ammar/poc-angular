export class BaseModel {
    id?: string;
    expand?:boolean = true;
    disabled?: boolean = true;
    checked?:boolean = true;
    description?:string;
    creation_date?:Date;
    update_date?:Date;
} 