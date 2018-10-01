# StyleExplorer
This project is part of the bachelor thesis "Visualization of Writing Styles" by Thibault Gerrier (thibault.gerrier@student.uibk.ac.at) under the supervision of Michael Tschuggnall, PhD (michael.tschuggnall@uibk.ac.at)

## Run the project locally
This project requires [Meteor](meteor.com) for the server and [Java 1.8](java.com) & [Maven](maven.apache.org) for building required jar file.

### Meteor
```
git clone https://github.com/ThibaultGerrier/StyleExplorer.git
cd StyleExplorer
meteor npm install
meteor npm run dev
```
Meteor will download all required Meteor and npm packages and will start the server. The tool will now run under localhost:3000.

### Java jar
Additionally another github project is needed, to build the 1+ GB Jar file that calculates the features:
https://github.com/balthazur/TextFeatures

```
git clone https://github.com/balthazur/TextFeatures.git
```

The pom.xml file at TextFeatures/TextFeaturesMaven/pom.xml has to be replaced with StyleExplorer/java/pom.xml
Additionally the file StyleExplorer/java/Main.java has to be moved/copied to TextFeatures/TextFeaturesMaven/src/main/Main.java

The java jar can be build with:
```
mvn validate
mvn clean install
```
Should the maven build be successful, it will generate a jar file under TextFeatures\TextFeaturesMaven\target\TextFeaturesMaven-1.0-jar-with-dependencies.jar.

The link to this jar file has to be added to StyleExplorer/settings.json, by simply rewriting the key to the json property "jarLocation" (Please enter an absolute path).

For problems please contact me at thibault.gerrier@student.uibk.ac.at.
