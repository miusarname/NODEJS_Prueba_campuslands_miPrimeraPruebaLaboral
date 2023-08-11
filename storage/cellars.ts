import { Type, Transform, Expose } from "class-transformer";

export class Cellars {
  @Expose({ name: "nombre" })
  @Transform(({value})=>{
    let data = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/g.test(value)
    if (data){
        return value
    }else{
        throw {status : 500, message : "Error: Invalid data type or structure. Please ensure that the provided data matches the expected format. For more information, please visit https://github.com/miusarname/NODEJS_Prueba_campuslands_miPrimeraPruebaLaboral"}
    }
  })
  NAME: string;
  @Expose({ name: "id_responsable" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw {status : 500, message : "Error: Invalid data type or structure. Please ensure that the provided data matches the expected format. For more information, please visit https://github.com/miusarname/NODEJS_Prueba_campuslands_miPrimeraPruebaLaboral"}
    }
  })
  RESPONSIBLE_NUMBER: number;
  @Expose({ name: "estado" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw {status : 500, message : "Error: Invalid data type or structure. Please ensure that the provided data matches the expected format. For more information, please visit https://github.com/miusarname/NODEJS_Prueba_campuslands_miPrimeraPruebaLaboral"}
    }
  })
  STATUS: number;
  @Expose({ name: "created_by" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw {status : 500, message : "Error: Invalid data type or structure. Please ensure that the provided data matches the expected format. For more information, please visit https://github.com/miusarname/NODEJS_Prueba_campuslands_miPrimeraPruebaLaboral"}
    }
  })
  CREATED_BY: number;
  @Expose({ name: "update_by" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw {status : 500, message : "Error: Invalid data type or structure. Please ensure that the provided data matches the expected format. For more information, please visit https://github.com/miusarname/NODEJS_Prueba_campuslands_miPrimeraPruebaLaboral"}
    }
  })
  UPDATED_BY: number;

  constructor(
    param1: string,
    param2: number,
    param3: number,
    param4: number,
    param5: number
  ) {
    this.NAME = param1;
    this.RESPONSIBLE_NUMBER = param2;
    this.CREATED_BY = param4;
    this.UPDATED_BY = param5;
    this.STATUS = param3;
  }
}
