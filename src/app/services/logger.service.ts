import { Injectable } from '@angular/core';
import { LogModel } from '../models/log-model';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() {
    this.enableLogging = true;
  }
  public enableLogging: boolean

  public logInfo(logModel: LogModel) {
    if (logModel && this.enableLogging) {
      console.log(JSON.stringify(logModel))
    }
  }

  public logError(logModel: LogModel) {
    if (logModel && this.enableLogging) {
      console.error(JSON.stringify(logModel))
    }
  }
  public logWarn(logModel: LogModel) {
    if (logModel && this.enableLogging) {
      console.warn(JSON.stringify(logModel))
    }
  }

  public getLogObject(source: string, message: string, uid?: string) {
    if (source && message) {
      let logObject: LogModel = new LogModel();

        logObject.source = source;
        logObject.message = message;
       logObject.uid = uid ? uid : ''
      
     
      return logObject
    }
    return null;
  }

}
