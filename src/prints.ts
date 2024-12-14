export const errorStatus = (response: Res): Boolean => response.statusCode >= 300
export const printSilence = (responses: Array<Res>) => {
  const forPrint = responses.filter(errorStatus)
  console.log(forPrint);
};
export const printVerbose = (responses: Array<Res>) => {
  console.log(responses);
};
