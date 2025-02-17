import inquirer from 'inquirer';
import { startProcess } from './core.js';

const knownRepositoryList = [
    'account-service',
    'common-context-helper',
    'insurance-helper',
    'model-repository',
    'rest-service',
]

console.log('Git Clickup Cherry Pick Helper, v0.1\n');
console.log('This tool will help you on cherry picking commits from a list of repositories based on a clickup ticket id.\n');

inquirer
    .prompt([
        { type: 'input', name: 'inputToken', message: "Paste your github token or hit enter if you have it exported to CHERRY_PICKER_TOKEN" },
        { type: 'input', name: 'clickupIds', message: "What's the clickup ticket id? Comma separated if more than one", validate: validateClickupIds },
        { type: 'checkbox', name: 'reposList', message: "What repos should be looked?", choices: knownRepositoryList, validate: validateRepositoryList },
        { type: 'input', name: 'sinceDate', message: "What's the date to start looking from? Format: 2025-01-30", validate: validateDate, default: '2025-01-30' },
    ])
    .then((answers) => {
        const { inputToken, clickupIds, reposList, sinceDate } = answers;
        startProcess(clickupIds, reposList, sinceDate, inputToken);
    });

function validateClickupIds (clickupIds) {
    const ids = clickupIds.split(',');
    
    const clickupIdRegex = /^[0-9a-zA-Z]/;
    const isValid = ids.every(id => clickupIdRegex.test(id));

    return isValid ? true : 'Please enter a valid clickup id';
}

function validateRepositoryList (reposList) {
    const isValid = reposList.length > 0;

    return isValid ? true : 'Please select at least one repository';
}

function validateDate (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isValid = dateRegex.test(date);

    return isValid ? true : 'Please enter a valid date format: 2025-01-30';
}
