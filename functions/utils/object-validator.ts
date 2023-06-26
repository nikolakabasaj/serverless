export const isEmpty = (obj: any) => Object.keys(obj).length === 0;

export async function updateObject<T extends object>(objectToUpdate: T, newData: T): Promise<void> {
  const keys = Object.keys(newData) as (keyof T)[];
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(objectToUpdate, key) && objectToUpdate[key] !== newData[key]) {
      objectToUpdate[key] = newData[key]!;
    }
  }
}