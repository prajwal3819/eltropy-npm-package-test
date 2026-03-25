# goremon
# Release Version : "9.10.34"
Code "GO-RE-MON" is derived from Golang, ReactJS and MongoDB. 

## Packages

- Analytics
- Auth
- Messages

Each package is an individual React + Redux application written in TypeScript.

Steps to install and run the app on development environments, for example `auth` :
```
cd auth
npm i
npm start
```

Use following to run the app on production environments, for example `messages` :

```
cd messages
npm run build
```

Above command will create a build folder having required artifacts.

## Style linting
At the root of the repo, pre-commit hooks are configured inorder to run some checks 
which include code + style linting along with generating the build 
before committing the local changes to `git`.

```
cd goremon
npm i
```

##### Note:
Ensure that the pre-commit hooks are configured at the root of the repo and not
at the individual package by verifying if `lerna` is being executed at the time of 
pre-commit check.
