const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

type LevelValue = { [level: string]: {values: string[], parent: string }};

function userParserWithSort(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }

  const commaDelimitedValuesStringified = removeRootParenthesis(inputTrimmed)

  let currentValue: string = '';
  let currentLevel = 0;
  let levelValue: LevelValue = {};

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

      levelValue = setLevelValue(levelValue, currentLevel, currentValue);
      currentValue = '';
      continue;
    }

    if (indexValue !== '(' && indexValue !== ')') {
      currentValue += indexValue;
      continue;
    }

    if (indexValue === '(') {
      levelValue = setLevelValue(levelValue, currentLevel, currentValue);
      currentLevel += 1;

      currentValue = '';
      continue;
    }

    if (indexValue === ')') {
      if (currentValue) {
        levelValue = setLevelValue(levelValue, currentLevel, currentValue);
      }

      currentLevel -= 1;
      currentValue = '';
      continue;
    }
  }
  let output = '';

  Object.keys(levelValue).forEach((level) => {
    const sortedValues = levelValue[level].values.sort();
    console.log('sortedValues', sortedValues);

    sortedValues.forEach((value) => {
      output += ('\n' + (new Array(Number(level) * 2).join(' ')) + `- ${value}`);

        if (levelValue[Number(level) + 1]?.parent === value) {
          const childValuesSorted = levelValue[Number(level) + 1].values.sort();

          childValuesSorted.forEach((value) => {
            output += ('\n' + (new Array((Number(level) + 1) * 2).join(' ')) + `- ${value}`);

            if (levelValue[Number(level) + 2]?.parent === value) {
              const grandChildValuesSorted = levelValue[Number(level) + 2].values.sort();
              grandChildValuesSorted.forEach((value) => {
                output += ('\n' + (new Array((Number(level) + 2) * 2).join(' ')) + `- ${value}`);
              });
            }
          });
        }
    });
  });

  console.log('level value', levelValue)
  console.log('output value', output)

  return '';
}

function setLevelValue(levelValue: LevelValue, currentLevel: number, currentValue: string) {
  const updatedLevelValue = {...levelValue};
  if (levelValue[`${currentLevel}`]?.values){
    updatedLevelValue[`${currentLevel}`].values = [...levelValue[`${currentLevel}`].values, currentValue];
  } else {
    if (currentLevel > 0) {
      const valuesOfPreviousLevel = levelValue[`${currentLevel - 1}`].values;
      const parent= valuesOfPreviousLevel[valuesOfPreviousLevel.length - 1];
      updatedLevelValue[`${currentLevel}`] = { parent, values: [currentValue] };
    } else {
      updatedLevelValue[`${currentLevel}`] = { parent: 'root', values: [currentValue] };
    }
  }

  return updatedLevelValue;
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