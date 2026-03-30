const TEST_INPUT = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";
const TEST_INPUT_2 = "(id, name, email, type(id, name, customFields(c1, z2, c3, phoneInfo(platform, model, year))), externalId, config(fontSettings, screenSettings))";

type LevelValue = {values: string[], parent: string, level: number };

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
        if (isLastValue && currentValue && indexValue !== ')') {
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
    return output;
  } catch (e) {
    console.error(e);
    return '';
  }
}

// userParserV2: Returns sorted output
function userParserV2(input: string): string {
  try {
    const processedInput = prepareInputForParser(input);
    const levelValue = parseInputIntoLevelObject(processedInput);
    let output = '';

    const rootLevel = levelValue.find(data => data.parent === 'root');
    const rootDataLevel = rootLevel?.level;

    if (!rootLevel || rootDataLevel === undefined || isNaN(rootDataLevel)) {
      throw new Error('LevelValue object does not contain a root');
    }

    const sortedLevels = levelValue.map(levelValue => levelValue.level).sort();
    const maxLevel = sortedLevels.pop();
    const sortedRootValues = rootLevel.values.sort();

    sortedRootValues.forEach((value) => {
      output += ('\n' + (new Array(rootDataLevel * 2).join(' ')) + `- ${value}`);
      let currentLevel = rootDataLevel;

      if (maxLevel && currentLevel < maxLevel) {
        const childLevel = currentLevel + 1;
        output += setLevelOutputs(levelValue, childLevel, rootLevel.parent, maxLevel, value);
      }
    });

    return output;
  } catch (e) {
    console.error(e);
    return '';
  }
}

function parseInputIntoLevelObject(processedInput: string): LevelValue[] {
  let currentValue: string = '';
  let currentLevel = 0;
  let levelValue: LevelValue[] = [];

  for (let i = 0; i < processedInput.length; i++) {
    const indexValue = processedInput[i];

    if (indexValue === ' ') {
      continue;
    }

    const lastValue = i === processedInput.length - 1;

    if (indexValue === ',' || lastValue) {
      if (lastValue && indexValue !== ')') {
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
    }
  }

  return levelValue;
}

function setLevelValue(levelValue: LevelValue[], currentLevel: number, currentValue: string) {
  let updatedLevelValue = [...levelValue];
  let parent = 'root';

  if (currentLevel > 0) {
    const previousLevelValue = levelValue.filter(data => data.level === (currentLevel - 1)).pop();
    parent = previousLevelValue?.values[previousLevelValue.values.length - 1] ?? '';
    if (!parent) {
      throw new Error("Parent not found")
    }
  }

  if (levelValue.some(data => data.level === currentLevel && data.parent === parent)){
    updatedLevelValue = updatedLevelValue.map(data => {
      if (data.level === currentLevel && data.parent === parent) {
        return {...data, values: [...data.values, currentValue]}
      }
      return data;
    });
  } else {
    if (currentLevel > 0) {
      updatedLevelValue.push({ parent, values: [currentValue], level: currentLevel });
    } else {
      updatedLevelValue.push({ parent, values: [currentValue], level: currentLevel });
    }
  }

  return updatedLevelValue;
}

function setLevelOutputs(levelValue: LevelValue[], currentLevel: number, currentParent: string, maxLevel: number, currentValue: string): string {
  let output = '';

  const match = levelValue.find(data => data.level === currentLevel && data.parent === currentValue);

  if (match) {
    const childValuesSorted = match.values.sort();

    childValuesSorted.forEach((value) => {
      output += ('\n' + (new Array((currentLevel) * 2).join(' ')) + `- ${value}`);

      if (Number(currentLevel) < maxLevel) {
        output += setLevelOutputs(levelValue, currentLevel + 1, match.parent, maxLevel, value);
      }
    });
  }

  return output;

}

function addNewLine(leadingWhiteSpaces: number, currentValue: string) {
  if (leadingWhiteSpaces) {
    return ('\n' + (new Array(leadingWhiteSpaces).join(' ')) + `- ${currentValue}`);
  }
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

const outputV1 = userParserV1(TEST_INPUT);
const outputV2 = userParserV2(TEST_INPUT);
const outputV1Test2 = userParserV1(TEST_INPUT_2);
const outputV2Test2 = userParserV2(TEST_INPUT_2);
console.log('userParserV1 output test 1: ', outputV1)
console.log('userParserV2 output test 1: ', outputV2)
console.log('userParserV1 output test 2: ', outputV1Test2)
console.log('userParserV2 output test 2: ', outputV2Test2)

