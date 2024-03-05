/* eslint-disable no-console */
export function tap<T>(data: T, stringify = false): T {
  if (stringify) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }

  return data;
}
