const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";
const PARENTHESIS = ['(', ')']
function userParser(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }


  const commaDelimitedValuesStringified = removeRootParenthesis(inputTrimmed)

  const split = commaDelimitedValuesStringified.split('(');
  const output: string = '';
  console.log('CommaDelimitedValuesStringified', commaDelimitedValuesStringified)
  console.log('split', split)
  const parentValues: string[] = [];
  const output: string = '';
  let leadingWhiteSpaces = 0;

  let currentValue: string = '';
  for (let i = 0; i < commaDelimitedValuesStringified.length; i++) {
    const indexValue = commaDelimitedValuesStringified[i];

    if (!indexValue) {
      continue;
    }

    if (indexValue === ',') {
      if (leadingWhiteSpaces) {
        parentValues.push('\n' + (new Array(leadingWhiteSpaces).join(' ')) + ` - ${currentValue}`);
        currentValue = '';
      } else {
        parentValues.push(`\n- ${currentValue}`);
        currentValue = '';
      }

      continue;
    }

    if (indexValue !== '(' && indexValue !== ')') {
      currentValue.concat(indexValue);
    }

    if (indexValue === '(') {
      leadingWhiteSpaces += 2;
      parentValues.push(`\n- ${currentValue}`);
      currentValue = '';
      continue;
    }

    if (indexValue === ')') {
      leadingWhiteSpaces -= 2;
      parentValues.push(`\n- ${currentValue}`);
      currentValue = '';
      continue;
    }

    currentValue += indexValue;
  }

  console.log('parentValues', parentValues);

  const splitValues = splitInputByComma(commaDelimitedValuesStringified);
  console.log('splitValues', splitValues)

  // for (let i = 0; i < splitValues.length; i++) {
  //   const indexValue = splitValues[i];
  //   if (indexValue.includes('(') || in)
  //   splitValues[i];
  // }
  return splitValues.toString();
}

function splitInputByComma(input: string): string[] {
  return input.split(',');
}

function removeRootParenthesis(input: string): string {
  return input.substring(1, input.length - 1);
}

userParser(TEST_INPUT);