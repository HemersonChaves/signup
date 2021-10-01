interface HttpResponse{
    statusCode:number
    body: any
}

export {HttpResponse}

interface HttpRequest{
    body?: any
}

export {HttpRequest}