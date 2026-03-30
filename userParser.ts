const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

function userParserWithSort(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }

  const commaDelimitedValuesStringified = removeRootParenthesis(inputTrimmed)

  let output: string = '';
  let leadingWhiteSpaces = 0;
  let currentValue: string = '';
  let currentLevel = 0;
  const levelValue : { [level: string]: {values: string[], parent: string }} = {};

  for (let i = 0; i < commaDelimitedValuesStringified.length; i++) {
    const indexValue = commaDelimitedValuesStringified[i];

    if (indexValue === ' ') {
      continue;
    }

    const lastValue = i === commaDelimitedValuesStringified.length - 1;

    if (indexValue === ',' || lastValue) {
      if (lastValue) {
        currentValue += indexValue;
      }

      if (!currentValue) {
        continue;
      }

      if (levelValue[`${currentLevel}`]?.values){
        levelValue[`${currentLevel}`].values = [...levelValue[`${currentLevel}`].values, currentValue];
      } else {
        levelValue[`${currentLevel}`] = { parent: '', values: [currentValue] };
      }

      output += addNewLine(leadingWhiteSpaces, currentValue);
      currentValue = '';
      continue;
    }

    if (indexValue !== '(' && indexValue !== ')') {
      currentValue += indexValue;
      continue;
    }

    if (indexValue === '(') {
      if (levelValue[`${currentLevel}`]?.values){
        levelValue[`${currentLevel}`].values = [...levelValue[`${currentLevel}`].values, currentValue];
      } else {
        levelValue[`${currentLevel}`] = { parent: '', values: [currentValue] };
      }
      output += addNewLine(leadingWhiteSpaces, currentValue);
      currentLevel += 1;
      leadingWhiteSpaces += 2;

      currentValue = '';
      continue;
    }

    if (indexValue === ')') {
      if (currentValue) {
        if (levelValue[`${currentLevel}`]?.values){
          levelValue[`${currentLevel}`].values = [...levelValue[`${currentLevel}`].values, currentValue];
        } else {
          levelValue[`${currentLevel}`] = { parent: '', values: [currentValue] };
        }
        console.log('currentValue', currentValue, leadingWhiteSpaces)
        output += addNewLine(leadingWhiteSpaces, currentValue);
      }

      currentLevel -= 1;
      leadingWhiteSpaces -= 2;
      currentValue = '';
      continue;
    }
  }

  console.log('level value', levelValue)

  return output;
}

function userParser(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }

  const commaDelimitedValuesStringified = removeRootParenthesis(inputTrimmed)

  let output: string = '';
  let leadingWhiteSpaces = 0;
  let currentValue: string = '';

  for (let i = 0; i < commaDelimitedValuesStringified.length; i++) {
    const indexValue = commaDelimitedValuesStringified[i];

    if (indexValue === ' ') {
      continue;
    }

    const lastValue = i === commaDelimitedValuesStringified.length - 1;

    if (indexValue === ',' || lastValue) {
      if (lastValue) {
        currentValue += indexValue;
      }

      if (!currentValue) {
        continue;
      }

      output += addNewLine(leadingWhiteSpaces, currentValue);
      currentValue = '';
      continue;
    }

    if (indexValue !== '(' && indexValue !== ')') {
      currentValue += indexValue;
      continue;
    }

    if (indexValue === '(') {
      output += addNewLine(leadingWhiteSpaces, currentValue);
      leadingWhiteSpaces += 2;

      currentValue = '';
      continue;
    }

    if (indexValue === ')') {
      if (currentValue) {
        console.log('currentValue', currentValue, leadingWhiteSpaces)
        output += addNewLine(leadingWhiteSpaces, currentValue);
      }

      leadingWhiteSpaces -= 2;
      currentValue = '';
      continue;
    }
  }

  return output;
}

function addNewLine(leadingWhiteSpaces: number, currentValue: string) {
  if (leadingWhiteSpaces) {
    // parentValues.push('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
    return ('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
  }
  // parentValues.push(`\n- ${currentValue}`);
  return (`\n- ${currentValue}`);
}

function removeRootParenthesis(input: string): string {
  return input.substring(1, input.length - 1);
}

userParserWithSort(TEST_INPUT);


// userParser(TEST_INPUT);