sh -c 'cd ../chineseviewer_ts && yarn run build'
./gradlew shadowJar
heroku deploy:jar chineseviewer-all.jar -a chineseviewer