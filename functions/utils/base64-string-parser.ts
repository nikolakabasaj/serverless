export function parseContentType(content: string) { 
    return content.split(';')[0].split(':')[1]; 
}

export function parseImageBase64String(content: string) { 
    return content.replace(/^data:image\/[a-z]+;base64,/, ""); 
}
