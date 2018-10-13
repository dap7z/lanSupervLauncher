### Installation :
root@webserver:/var/www/nodeapps/lanSupervLauncher# 
npm install


### Configuration:
cp config.js.sample config.js
vi config.js

CONFIG['NMAP_LOCATION'] = 'nmap';   //Default
//CONFIG['NMAP_LOCATION'] = 'C:/Program Files (x86)/Nmap/nmap.exe';       //Windows

CONFIG['GUN_ADDITIONAL_PEERS'] = [];
//CONFIG['GUN_ADDITIONAL_PEERS'] = ['https://main-server-domain.com/gun'];


### Auto start up:
#
# Linux (pm2)
# -- required installations: node,nmap,pm2 --
cd /var/www/nodeapps/lanSupervLauncher
pm2 start
#
# Windows (service)
# -- required installations: node,nmap --
cd D:\SRV_APACHE\lanSupervLauncher#
D:
node main.js


### Update: application check for update at launch