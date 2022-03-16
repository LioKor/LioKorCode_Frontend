## LioKor JavaScript Education

**LKJSE** assists JS learning by classic algorithmic practice. It consists of task book (html select), code editor (Ace) and testing engine.

#### How to build:
1. Install yarn https://yarnpkg.com/ (npm can be used too)
2. Open terminal and navigate to project folder
3. Install dependencies ```yarn```
4. Build ```yarn build```
5. After building copy content of ```dist``` folder to your web server

#### Adding and customizing tasks:
* Navigate to ```static/tasks```
* ```list.json``` contains file names of tasks to be shown
* In this folder can create new tasks (copy the existing one and use it as a template) or edit the existing ones
* Don't forget to add the new task to ```list.json```

#### Development:
* Use ```yarn dev``` to start dev server
