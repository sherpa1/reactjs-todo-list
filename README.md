# Todo List with React.js

## Instructions

### Env vars

A root level, create a file called `.env` and insert :

```
NODE_ENV=production
REACT_APP_ENDPOINT=https://<project-id>.directus.app/items/tasks/
```

### Development

- First install NPM dependencies :

```
npm install
```

- Then, start project :

```
npm start
```

### Production

- build project :
```
npm build
```

## REST API

Headless CMS

https://directus.io/

- Back Office : https://8s0fqfqq.directus.app/admin/login
- API : https://8s0fqfqq.directus.app/items/tasks

### Data Model

#### Task

- id : uuid v4 (36 chars),
- completed : boolean (default false),
- content : text,
- created : datetime
- updated : datetime

Exemple :

```
{
    "id":"28860c72-b13a-494e-b363-e1790df137b2",
    "completed":true,
    "created":"2022-05-24T09:24:00",
    "content":"Learn and understand Redux",
    "updated":"2022-05-24T09:41:34"
}
```

### API Reference

https://docs.directus.io/reference/introduction/

#### Items

https://docs.directus.io/reference/items/

## Refactoring to do

- merge EditTaskForm and AddTaskForm
- create only one method "confirm_delete" (code duplication)
- better deal API interactions
- organize each component in separated files

---

__Alexandre Leroux__

_Développeur logiciel full stack web & mobile_

_Enseignant à l'Université de Lorraine_

- _Institut des Sciences du Digital, Management & Cognition (Masters Sciences-Cognitives)_

- _IUT Nancy-Charlemagne (Licence Professionnelle CIASIE)_

<br>

Website : https://sherpa.one

Mail : alex@sherpa.one

Github : sherpa1

Discord : sherpa#3890
