import { Octokit } from "octokit";
import chalk from 'chalk';

export const startProcess = async (clickupId, reposList, sinceDate, inputToken) => {
    const token = inputToken || process.env.CHERRY_PICKER_TOKEN;
    if (!token) {
        console.log('Missing github token, exiting...');
        return;
    }

    if (reposList.length === 0 || !clickupId || !sinceDate) {
        console.log('Missing required parameters, exiting...');
        return;
    }

    try {
        await listAllCommits(clickupId, reposList, sinceDate, token);
    } catch (error) {
        console.log('An error occurred while fetching the commits', error);
    }
}

const listAllCommits = async (clickupId, reposList, sinceDate, inputToken) => {    
    // going for a sequential approach to avoid rate limiting, the commits api is already pretty fast
    for (const repositoryName of reposList) {
        console.log(`\n\n### Listing ${chalk.bold(repositoryName)} commits:\n`);

        const commitsResponse = await getCommitsPerRepoName(repositoryName, sinceDate, inputToken);
        // not a fan of looping twice the list, but it's the best way to not leave the user in the dark for when there are no commits
        // and the list is always < 20 items
        const filteredCommits = commitsResponse.filter(commitObject => shouldCommitBePrinted(commitObject, clickupId))
        if (filteredCommits.length === 0) {
            console.log('No commits found for this repository');
            continue;
        }
        filteredCommits.forEach(printCommitDetails);
    }
};

const getCommitsPerRepoName = async (repositoryName, sinceDate, token) => {
    const octokit = new Octokit({ auth: token });
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'lumahealthhq',
        repo: repositoryName,
        sha: 'blue',
        per_page: 20,
        since: sinceDate,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch commits for ${repositoryName} ${response.status} ${response.statusText}`);
    }
    return response.data;
}

const shouldCommitBePrinted = (commitObject, clickupId) => {
    // we want only the ticekts from the given clickup id, this can be updated to be a message or similar
    const isFromClickupTicket = commitObject.commit.message.includes(clickupId);
    // bump commits should not be cherry picked, we need to come up with a better naming strategy
    const isBumpCommit = commitObject.commit.message.toLowerCase().includes('chore') && commitObject.commit.message.toLowerCase().includes('bump');
    // simple commits have only one parent while merge commits will always have more than one parent
    const isMergeCommit = commitObject.parents.length > 1;

    return isFromClickupTicket &&  !isBumpCommit && !isMergeCommit;
};

const printCommitDetails = (commitObject) => {
    console.log(commitObject.commit.author.name);
    console.log(commitObject.commit.message);
    console.log(commitObject.commit.committer.date);
    console.log(chalk.blue(commitObject.sha));
    console.log('-------------------------------------------------------------\n');
}
