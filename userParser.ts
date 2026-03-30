const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

function userParser(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }

  const CommaDelimitedValuesStringified = removeRootParenthesis(inputTrimmed)
  console.log('CommaDelimitedValuesStringified', CommaDelimitedValuesStringified)
  const splitValues = splitInputByComma(CommaDelimitedValuesStringified);
  console.log('splitValues', splitValues)
  return splitValues.toString();
}

function splitInputByComma(input: string): string[] {
  return input.split(',');
}

function removeRootParenthesis(input: string): string {
  return input.substring(1, input.length - 1);
}

userParser(TEST_INPUT);