export const validate = (response: Res): Boolean => response.statusCode >= 300 || response.slow

export const printSilence = (responses: Array<Res>) => {
  const forPrint = responses.filter(validate)
  console.log(forPrint);
};
export const printVerbose = (responses: Array<Res>) => {
  console.log(responses);
};
