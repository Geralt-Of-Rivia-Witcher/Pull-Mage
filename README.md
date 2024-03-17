<p align="center">
  <h1 align="center">Pull Mage</h1>

  <p align="center">
    <h3 align="center">Pull Mage is your ultimate companion for managing PRs on GitHub. With Pull Mage, you can streamline your code review process, gain insights into your changes, and get answers to your questions — all in one place.</h3>
    <p align="center" >
      <a href="https://github.com/apps/pull-mage">Public Page</a>
    </p>
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    <li><a href="#built-with">Built With</a></li>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#installation-from-github-public-page">Installation from GitHub Marketplace
</a></li>
        <li><a href="#how-to-use">How to Use</a></li>
      </ul>
    </li>
    <li><a href="#notes">Notes</a></li>
    <li>
      <a href="#running-locally">Running locally</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Pull Mage is a powerful tool designed to streamline the pull request (PR) process on GitHub. Whether you're a developer seeking feedback on your code changes or a reviewer providing insights and suggestions, Pull Mage simplifies and enhances the PR experience for everyone involved.

With Pull Mage, you can:

- Request comprehensive reviews of your PRs, receiving detailed feedback to improve code quality.
- Gain deep insights into the changes included in your PRs, with contextual explanations provided for each modification.
- Ask questions related to your PRs, getting prompt answers within the context of your changes.
- Leverage AI-driven assistance to analyze code changes, provide recommendations, and answer queries efficiently.

Pull Mage aims to promote collaboration, enhance code quality, and facilitate smoother workflows in GitHub repositories. Whether you're a solo developer or part of a team, Pull Mage is here to support you in achieving your goals and making your PR process more effective and efficient.
<br />

### Built With

<img src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" width="50" height="50"> [<img src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" width="52" height="52">](https://www.typescriptlang.org/) [<img src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/519bfaf3-c242-431e-a269-876979f05574" width="50" height="50">](https://nestjs.com/)
<br />

<!-- Usage -->

## Usage

### Installation from GitHub Public Page

1. Visit the [Pull Mage GitHub Public page](https://github.com/apps/pull-mage).
2. Click on the "Install" button to add Pull Mage to your GitHub repositories.

### How to Use

1. After installing Pull Mage from the GitHub Marketplace, navigate to your GitHub repository.
2. Create a new pull request (PR) or open an existing one.
3. In the comments section of the PR, use the following commands to interact with Pull Mage:
   - `/review`: Request a review of your PR.
   - `/explain`: Get a detailed explanation of the changes in your PR.
   - `/ask = question`: Ask a question related to your PR.
4. Pull Mage will process your request and provide the requested feedback or information within the context of your PR.

That's it! With Pull Mage installed and configured in your GitHub repository, you can streamline your PR process and enhance collaboration with ease.

<!-- Notes -->

## Notes

- **Project Status**: Pull Mage is a personal project and is currently running on free credits of OpenAI's API.
- **Server Deployment**: The server is deployed on a free tier. It may go down if it does not receive requests for a few minutes. You can ping [https://pull-mage.siddhantkumarsingh.me/](https://pull-mage.siddhantkumarsingh.me/) to bring it back up.

<!-- Running locally -->

## Running locally

To get a local copy up and running follow these simple example steps.

### Prerequisites

- **npm** or **yarn**

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Geralt-Of-Rivia-Witcher/Darkhold
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. Ceate a `.env` file with following environment variables.

   ```JS
   APP_PORT = 'ENTER YOUR PORT HERE'
   GITHUB_APP_ID = 'ENTER YOUR GITHUB ID HERE'
   GITHUB_WEBHOOK_SECRET = 'ENTER YOUR GITHUB WEBHOOK SECRET HERE (not being used currently)'
   GITHUB_PRIVATE_KEY = 'ENTER YOUR GITHUB PRIVATE KEY HERE'
   OPENAI_API_KEY = 'ENTER YOUR OPENAI PRIVATE KEY HERE'
   ```

   you can get GITHUB_APP_ID and GITHUB_PRIVATE_KEY by creating a GitHub app from GitHub Developer settings: [Guide](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/quickstart)

4. Start the server
   ```JS
   yarn start:dev
   ```
   The server will listen on APP_PORT specified in the `.env` file.

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b branch_name`)
3. Commit your Changes (`git commit -m 'Added some AmazingFeature'`)
4. Push to the Branch (`git push origin branch_name`)
5. Open a Pull Request

<!-- CONTACT -->

## Contact

[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white">](https://www.linkedin.com/in/siddhant-kumar-singh-/) [<img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"></img>](mailto:singhsiddhantkumar@gmail.com)
