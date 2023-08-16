export class ErrorHandler {
    errorHandle: Error | Object | Array<string | Object>;
  
    constructor(errorToHandle: any) {
      this.errorHandle = errorToHandle.errInfo.details.schemaRulesNotSatisfied;
    }
  
    private errorHandlers = {
      ECONNREFUSED: {
        status: 503,
        message:
          "No se pudo establecer conexión con el servidor de base de datos.",
      },
      ENETUNREACH: {
        status: 503,
        message:
          "No se puede alcanzar la red que aloja el servidor de base de datos.",
      },
      AuthenticationFailed: {
        status: 401,
        message: "Error de autenticación al acceder a la base de datos.",
      },
      SyntaxError: {
        status: 400,
        message: "Error de sintaxis en una consulta a la base de datos.",
      },
      ValidationError: {
        status: 422,
        message:
          "Los datos proporcionados no cumplen con las reglas de validación.",
      },
      DocumentExpired: {
        status: 410,
        message: "El documento al que intenta acceder ha expirado.",
      },
      ServerClosed: {
        status: 503,
        message:
          "La conexión con el servidor de base de datos se cerró inesperadamente.",
      },
      MongoTimeoutError: {
        status: 504,
        message:
          "Tiempo de espera agotado al realizar una operación en la base de datos.",
      },
      BSONError: {
        status: 400,
        message: "Error relacionado con la codificación y decodificación BSON.",
      },
      properties: {
        status: 406,
        message:
          "Alguna de las propiedades que estas enviando estan de forma incorrecta, consulta con el admin 😎",
      },
      additionalProperties: {
        status: 413,
        message: "Tienes demasiadas propiedades, consulta con el admin 😎",
      },
      default: {
        status: 400,
        message:
          "Tienes algo mal en el envio, consulta con el admin 😎 o la documentacion 📜",
      },
    };
  
    public get handerErrorSucess(): Object {
      let responses: Object | string;
      if (Array.isArray(this.errorHandle)) {
        this.errorHandle.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            console.log(item.operatorName);
            switch (item.operatorName) {
              case "properties":
                responses = this.errorHandlers.properties;
                break;
              case "additionalProperties":
                responses = this.errorHandlers.additionalProperties;
                break;
  
              case "ECONNREFUSED":
                responses = this.errorHandlers.ECONNREFUSED;
                break;
  
              case "ENETUNREACH":
                responses = this.errorHandlers.ENETUNREACH;
                break;
  
              case "AuthenticationFailed":
                responses = this.errorHandlers.AuthenticationFailed;
                break;
  
              case "SyntaxError":
                responses = this.errorHandlers.SyntaxError;
                break;
  
              case "ValidationError":
                responses = this.errorHandlers.ValidationError;
                break;
  
              case "ServerClosed":
                responses = this.errorHandlers.ServerClosed;
                break;
  
              case "MongoTimeoutError":
                responses = this.errorHandlers.MongoTimeoutError;
                break;
  
              case "BSONError":
                responses = this.errorHandlers.BSONError;
                break;
  
              default:
                responses = this.errorHandlers.default;
                break;
            }
          }
        });
      }
      return responses;
    }
  }