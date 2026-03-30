const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

type LevelValue = { [level: string]: {values: string[], parent: string }};

// userParserV1: Returns unsorted output
function userParserV1(input: string): string {
  try {
    const processedInput = prepareInputForParser(input);

    let output: string = '';
    let leadingWhiteSpaces = 0;
    let currentValue: string = '';

    for (let i = 0; i < processedInput.length; i++) {
      const indexValue = processedInput[i];

      if (indexValue === ' ') {
        continue;
      }

      const isLastValue = i === processedInput.length - 1;

      if (indexValue === ',' || isLastValue) {
        if (isLastValue) {
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

      if (currentValue) {
        output += addNewLine(leadingWhiteSpaces, currentValue);
      }

      if (indexValue === '(') {
        leadingWhiteSpaces += 2;
      } else {
        leadingWhiteSpaces -= 2;
      }

      currentValue = '';
    }
    console.log('test1', output)
    return output;
  } catch (e) {
    console.error(e);
    return '';
  }

}

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

  const rootDataLevel = Object.keys(levelValue).find(key => levelValue[key].parent === 'root');

  if (!rootDataLevel) {
    throw new Error('Input is not a valid parenthetical value without root');
  }
  const sortedLevels = Object.keys(levelValue).map(levelValue => Number(levelValue)).sort();

  const sortedRootValues = levelValue[rootDataLevel].values.sort();

  const maxLevel = sortedLevels.pop();

  sortedRootValues.forEach((value) => {

    output += ('\n' + (new Array(Number(rootDataLevel) * 2).join(' ')) + `- ${value}`);
    let currentLevel = Number(rootDataLevel);

    if (maxLevel && currentLevel < maxLevel) {
      const childLevel = Number(rootDataLevel) + 1;
      output += setLevelOutputs(levelValue, `${childLevel}`, maxLevel, value);
    }
  });

  console.log('output value', output)
  return output;
}

function setLevelOutputs(levelValue: LevelValue, currentLevel: string, maxLevel: number, currentValue: string): string {
  let output = '';
  if (levelValue[currentLevel]?.parent === currentValue) {
    const childValuesSorted = levelValue[currentLevel].values.sort();

    childValuesSorted.forEach((value) => {
      output += ('\n' + (new Array((Number(currentLevel)) * 2).join(' ')) + `- ${value}`);

      if (Number(currentLevel) < maxLevel) {
        output += setLevelOutputs(levelValue, `${Number(currentLevel) + 1}`, maxLevel, value);
      }
    });
  }

  return output;

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

function prepareInputForParser(input: string): string {
  if (typeof input !== "string"){
    throw new Error('Input is not a valid string')
  }
  const inputTrimmed = input.trim()

  if (inputTrimmed[0] !== '(' || inputTrimmed[inputTrimmed.length -1] !== ')') {
    throw new Error('Input is not a valid parenthetical value');
  }

  return removeRootParenthesis(inputTrimmed)
}

// userParserWithSort(TEST_INPUT);


userParserV1(TEST_INPUT);