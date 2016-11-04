# share-url-test

Super simple app to test share URL activity

Añado una línea
Añado dos líneas

## Use via WebIDE

You can just get the content of the app folder and install it via WebIDE, in that case you need to enter the URL manually or use the default one.

## Using grunt

 By using grunt you can launch the Test Appl via command line.
 
### Configuring grunt
 
 As usual, before being able to use grunt you need to install the dependencies:
 
 ```
 $ npm install
 ```
 
 Then you can use very simple commands, the most interesting one is:

### pushclean
 
 ```
 $ grunt pushclean --url=<the_url_to_be_shared>
 ```
 
 This command will:
 a/ create a version of the application
 b/ kill the app if it's already running in the device
 c/ install the generated version
 d/ and launch it with the URL passed as parameter
asdf
asdf
asdf
asdf
### push
 
 Additionally, you can also use:
 
  ```
 $ grunt push --url=<the_url_to_be_shared>
  ```
  
 This command performs exactly the same than pushClean but without trying to kill the app in the device.
 
### release 
  
  ```
 $ grunt release --url=<the_url_to_be_shared>
  ```
  
 This command just creates the app with the configured URL so you can distribute it or use via WebIDE. The app will be available in releases/application.zip)
 
### Other Grunt goodies
 
 The Gruntfile includes also some features that allows you to interact via command line with any other 3rd party app:

Kill the app which ID corresponds to appname
 
  ```
$ grunt killApp:appname
  ```
Launch the app which ID corresponds to appname
 
  ```
$ grunt launchApp:appname
  ```

List all the running apps

  ```
$ grunt listRunningApps
   ```

List all the apps

  ```
$ grunt listAllApps
   ```
Añades una linea
 
 
