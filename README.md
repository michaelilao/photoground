<p align="center">
  <img src="https://raw.githubusercontent.com/michaelilao/photoground/main/public/android-chrome-512x512.png" width="100" />
</p>
<p align="center">
  <a href="https://photoground.dev/">
    <h1 align="center">photoground</h1>
  </a>
</p>
<p align="center">
    <em><code>photo gallery and storage solution</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/last-commit/michaelilao/photoground?style=default&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/michaelilao/photoground?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/michaelilao/photoground?style=default&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/DigitalOcean-%230167ff.svg?style=for-the-badge&logo=digitalOcean&logoColor=white">
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/michaelilao/photoground/main/docs/readme_image.png" alt="website snippet">
</p>
<hr>

## Quick Links

> - [ Overview](#-overview)
> - [ Getting Started](#-getting-started)
>   - [ Installation](#-installation)
>   - [ Running photoground](#-running-photoground)
>   - [ Tests](#-tests)
> - [ Features to Implement](#-features-to-implement)
> - [ Acknowledgments](#-acknowledgments)

---

## Overview

<code>Building this project as a simple express api/web server template, including sqlite db, support for file upload, jest unit-tests. Currently using this to test new ideas and learn new technolgies. This current version is deployed on a digital ocean VM using nginx and cloudflare.</code>

---

## Getting Started

**_Requirements_**

Ensure you have the following dependencies installed on your system:

- **Node**: <a href="https://nodejs.org/en">`v20.11.0`</a>
- **Sqlite3**: <a href="https://www.sqlite.org/download.html">`v3.41.1`</a>

### Installation

1. Clone the photoground repository:

```sh
git clone https://github.com/michaelilao/photoground
```

2. Change to the project directory:

```sh
cd photoground
```

3. Install the dependencies:

```sh
npm install
```

4. Create your .env file

```
cp .sample.env .env
```

### Running photoground

Use the following command to run photoground in dev mode:

```sh
npm run dev
```

To deploy photoground use:

```sh
npm run start
```

photoground uses tailwind, when any new classes are added run:

```sh
npm run tailwind
```

### Tests

To execute tests, run:

```sh
npm test
```

---

## Features to Implement

### Backend

- [ ] documentation for api swagger
- [ ] dynamic db statements / orm
- [ ] extract out db layer and file system layer
- [ ] favourite and tags

### Frontend

- [ ] dynamic gallery
- [ ] poll for recently added photos, poll for 30s after landing
- [ ] put modal image in its own class, better structure

### Cloud & Hosting

- [ ] SEO, sitemap.xml, searchable on google
- [ ] pipelines

### Misc

- [x] documentation/readme

### Bugs

- [ ] rotate bugs after saving - hard to recreate
- [ ] modal image/height sometimes not fitting

---

## Acknowledgments

- Icons: https://www.svgrepo.com/collection/solar-broken-line-icons/3
