# git-clickup-cherry-picker.v0.01

[![Running v0.01]](<video controls src="https://raw.githubusercontent.com/JefersonS/git-clickup-cherry-picker/main/demo/running-v001.mov" title="v001.mov"></video>)

## Overview

This is a script created to list commit hashes for use in cherry-picking operations. By providing one or more ClickUp ticket IDs, the script fetches all associated commits and lists their hashes in chronological order.

## Be careful!

This is v 0.01, it's a super constrained scope, but still, be extra aware of the date range used given currently we are not using pagination, with a max of 40 commits per micro-service.
If the desired commit is further down the list, it will not be displayed!

## Features Done

- Fetch commit hashes based on one or more ClickUp ticket IDs;
- Fetch based on date;
- Support multiple micro services;

## Features In-Progress

- Auto trigger cherry-picking; <- Most important here.
- Offer more visual helpers, like listing only the hashes or "view-more" commit props;
- Do pagination when more than 20 commits are found; <- currently a risk if trying to cherry pick from too far behind in date.

## Usage

1. Clone the repository:
    ```sh
    git clone /Users/jefersoneuclides/luma/git-clickup-cherry-picker
    ```
2. Navigate to the project directory:
    ```sh
    cd git-clickup-cherry-picker
    ```
3. Install packages:
    ```sh
    npm or pnpm or yarn install
    ```
4. Start the script:
    ```sh
    node interface.js
    or
    npm run start
    ```

## License

This project is licensed under the MIT License.