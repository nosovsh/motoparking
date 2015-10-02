# Motoparking.club
Web app that helps bikers to find nearest secure motorcycle parking.

Check it right now: http://www.motoparking.club

## Installaion
```
npm install
pip install -r requirements.txt
```
## Running dev server with hot reloading
`npm run dev` in one console

`python main.py` in another

## Deploying to Heroku
Create heroku app, create mongo database.

Create heroku config vars: `PROD_MONGODB`, `SECRET_KEY`, `SECURITY_PASSWORD_SALT`.

Deploy the code: `git push heroku master`

## Frontend
Frontend is writen using React.js, Fluxxor, Webpack, Leaflet.js, Babel and others.

### File structure
`components/` – React components. 

`components/dump/` – dump React components. Just view layer. They don't have access to the global state.
Everything should be passed to them throught `props`.

`components/smart/` – smart React components. They have access to the global state and pass portions of the state down to dump components. They don't have any visual representation and don't have any css styles. (`Map.jsx` is exception and should be refactored) 

`flux/` – FLUX packages. Each package has actions, constants, client and store

`styles/` – global and common styles.

### Styles
[BEM](https://en.bem.info/) methodology is used for styling. Convention: `BlockName_ElementName_modifierKey_ModifierValue` and `BlockName_ElementName_booleanModifier`

Styling of any component should be done in the file `ComponentName.css` in the same directory as component file.

### Code style
Run `npm run lint` to check code.

`eslint-config-airbnb` is used with some modifications. `"vars-on-top": 0` to make migration to `let` and `const` more easy. `"quotes": [2, "double", "avoid-escape"]` because I hate single quotes. See `.eslintrc` for more.

## Server side
Server is writen in `Python` using `Flask` framework and `MongoDB`. Server was developed in a short period of time so it is not perfect. It will be refactored soon.

## TODO:
- ES2015
- postCSS
- refactor css
- refactor map components and store to make them more reactive
- make stores more functional, without side effects to make migration to Redux more easy 
- refactor server side code

  
