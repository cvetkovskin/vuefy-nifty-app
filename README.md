# vuefy-nifty-app

## Project setup
```
npm install

// build it once so that it creates the www folder

cordova prepare (specifically: cordova platforms add browser)

Before you can serve it, check if the following files in the public folder are symbolic links
config.xml -> ../platforms/browser/www/config.xml
cordova -> ../platforms

If not create them with the command:
cd public/
ln -s <original file> <link name>
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
