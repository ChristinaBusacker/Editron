export function deepClone(object: any): boolean {
  return JSON.parse(JSON.stringify(object));
}
