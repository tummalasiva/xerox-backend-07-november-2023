"use strict";
const correlationId = require(`./correlation-id`)
const winston = require(`winston`)


function createLogger(opts = {}) {
	const { level, getCorrelationId, noCorrelationIdValue = `nocorrelation`,loggerName,disableLog } = opts
	 
	let enableLog =false;
	if(disableLog =="true" || disableLog ==true ){
		enableLog =true;
	}
	const logger =  winston.createLogger({
		colorize: true,
		silent: enableLog,
		format: winston.format.json(),
		format: winston.format.combine(
			winston.format((info) => {
				 info.correlationId = getCorrelationId() || noCorrelationIdValue
				return info
			})(),
			winston.format.timestamp(),
			winston.format.errors({ stack: true }),


			winston.format.printf(({ timestamp, correlationId, level, message,request,response,triggerNotification}) => {
				let params = ""
						if(request){
							params = `,"request" : ${JSON.stringify(request)} `;
						}
						if(triggerNotification){
							params = params + `,"triggerNotification": "${(triggerNotification)}" `;
						}	
						if(response){
							params = params + `,"response": ${JSON.stringify(response)} `;
						}	
						let completeResponse =  `{ "timestamp": "${timestamp}","correlationId": "${correlationId}","logger": "${loggerName}","level": "${level}", "message": `+ JSON.stringify(message) +params+`}`;
					
						return completeResponse;
			})
		),
		level,
		transports: [
			new winston.transports.Console({
				handleExceptions: true,
			}),
			new winston.transports.File({
				filename: loggerName+".log",
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.errors({ stack: true }),
					winston.format.json(),
					winston.format.printf(({ timestamp, correlationId, level, message,request,response,triggerNotification}) => {
						let params = ""
						if(request){
							params = `,"request" : ${JSON.stringify(request)} `;
						}
						if(triggerNotification){
							params = params + `,"triggerNotification": "${(triggerNotification)}" `;
						}	
						if(response){
							params = params + `,"response": ${JSON.stringify(response)} `;
						}	
						let completeResponse =  `{ "timestamp": "${timestamp}","correlationId": "${correlationId}","logger": "${loggerName}","level": "${level}", "message": `+ JSON.stringify(message)+params+`}`;
					
						return completeResponse;
						// return `${timestamp} ${loggerName} (${correlationId}) - ${level}: ${JSON.stringify(message)} ${params}`
					})
				),
			}),
		],
		exitOnError: false,
	})

	return logger;
}


let logger = {};
logger.config = (level,loggerName,disableLog) => {
	
	this.level = level;
	this.loggerName = loggerName;
	this.disableLog = disableLog;

};


logger.init = () => createLogger({
	level: this.level || 'info',
	loggerName: this.loggerName || 'elevate',
	disableLog: this.disableLog  || false,
 	getCorrelationId: correlationId.getId
 });


module.exports = logger
