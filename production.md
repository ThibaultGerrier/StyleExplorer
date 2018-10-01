## Building for production
A bundle has to be created of the project: `meteor npm run build` create a StyleExplorer.tar.gz file in the parent folder.
This archive has to be shipped to the server. Eg via scp: `scp StyleExplorer.tar.gz thibault@dbis-styleexplorer.uibk.ac.at:/home/thibault/style_explorer`.

After this you need to restart the node application with the new code.
```
ssh thibault@dbis-styleexplorer.uibk.ac.at
pm2 stop main   # stop the previous app
cd style_explorer
rm -rf bundler      # remove the previous code
tar -xzf StyleExplorer.tar.gz   # unpack bundle
rm StyleExplorer.tar.gz     # remove archive (optional)
cd bundle/programs/server
npm install     # install node dependencies
cd ~
pm2 start main      # restart application
```
