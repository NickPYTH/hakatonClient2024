let prod = false;
export const host = prod ? '' : 'localhost';
export const port = prod ? '' : ':8080/api';
export const secure = prod ? '' : 'http';
