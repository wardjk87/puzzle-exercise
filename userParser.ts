const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";
const PARENTHESIS = ['(', ')'];

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
  let output: string = '';
  console.log('CommaDelimitedValuesStringified', commaDelimitedValuesStringified)
  console.log('split', split)
  const parentValues: string[] = [];
  let leadingWhiteSpaces = 0;
  let currentValue: string = '';
  for (let i = 0; i < commaDelimitedValuesStringified.length; i++) {
    const indexValue = commaDelimitedValuesStringified[i];

    if (indexValue === ' ') {
      continue;
    }

    console.log('indexValue', indexValue)

    const lastValue = i === commaDelimitedValuesStringified.length - 1;

    if (indexValue === ',' || lastValue) {
      if (lastValue) {
        currentValue += indexValue;
      }

      if (!currentValue) {
        continue;
      }
      if (leadingWhiteSpaces) {
        output += ('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
        parentValues.push('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
        currentValue = '';
      } else {
        output += (`\n- ${currentValue}`);
        parentValues.push(`\n- ${currentValue}`);
        currentValue = '';
      }

      continue;
    }

    if (indexValue !== '(' && indexValue !== ')') {
      currentValue += indexValue;
      // currentValue.concat(indexValue);
    }

    if (indexValue === '(') {
      if (leadingWhiteSpaces) {
        output += ('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
        parentValues.push('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
      } else {
        output += (`\n- ${currentValue}`);
        parentValues.push(`\n- ${currentValue}`);
      }
      leadingWhiteSpaces += 2;

      currentValue = '';
      continue;
    }

    if (indexValue === ')') {
      if (currentValue) {
        console.log('currentValue', currentValue, leadingWhiteSpaces)
        if (leadingWhiteSpaces) {
          output += ('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
          parentValues.push('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
        } else {
          output += (`\n- ${currentValue}`);
          parentValues.push(`\n- ${currentValue}`);
        }
      }

      leadingWhiteSpaces -= 2;
      currentValue = '';
      continue;
    }
  }

  return output;
}

function removeRootParenthesis(input: string): string {
  return input.substring(1, input.length - 1);
}

userParser(TEST_INPUT);