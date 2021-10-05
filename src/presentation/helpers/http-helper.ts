
import { ServerError } from "../error/ServerError";
import { HttpResponse } from "../protocols/http";
export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})
export const serverError = (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError()
})