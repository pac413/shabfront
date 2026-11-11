# shabbat-frontend

## Project setup

```bash
npm install
```

## Compiles and hot-reloads for development

### Setting up Guide (Mac)

- Open up Keychain Access. Drag the development certificate file into Keychain Access. (/dev_certs/localhost.crt)
- Go into the Certificates section and locate the certificate you just added
- Double click on it, enter the trust section and under “When using this certificate” select “Always Trust”
- Run `sudo nano /etc/hosts` and add this line:

```bash
127.0.0.1       www.localhost
```

#### Setup localazy

- Install `localazy` cli from [here](https://localazy.com/docs/cli/installation).
- Request the Read/Write key for `localazy`.
- Export those keys into `localazy.keys.json` file.

  ```localazy upload -k localazy.key.json```

#### Run the project

- Run the following command to run the project on https

```bash
npm run serve
```

### Setting up Guide (Windows)

- Set up development certificate following this guide.
https://www.thewindowsclub.com/manage-trusted-root-certificates-windows

- Get your ip address first

```bash
echo `ifconfig $(netstat -nr | grep -e default -e "^0\.0\.0\.0" | head -1 | awk '{print $NF}') | grep -e "inet " | sed -e 's/.*inet //' -e 's/ .*//' -e 's/.*\://'`
```

- Open `c:\Windows\System32\Drivers\etc\hosts` as an administrator
- Add this line:

```bash
<your ip>       www.localhost
```

- Run the following command to run the project on https

```bash
npm run serve
```

Now the project is running on https://localhost:3000

### Compiles and minifies for production

```bash
npm run build
```

### Run your tests

```bash
npm run test
```

### Lints and fixes files

```bash
npm run eslint --fix
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## CodeStyle guide

- Keep all the type definitions related to the graphql schema in the `types/payloads`.
- Keep all the enum definitions related to the graphql schema in the `types/payloads/enums`.
- Keep all the frontend only related types to `types/*.ts`.
- Keep all the frontend only related types which will be used in `Vuex store` only will be saved to `types` folder of proper store module.
- Keep component-only types for that component's `prop` or `events` type definitions, will keep that in the component itself or `types.ts` file under that component.
- When you define any new `Vuex` store modules, you need to define it in `RootState` type which is defined in `store/types.ts`.
