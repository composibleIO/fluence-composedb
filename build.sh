rm -rf build_frontend/*
cp -r frontend/public/* build_frontend/

cd node_server 
npm run build
cd ..

rm -rf build_network/*
cp -r docker/* build_network
mkdir build_network/composedb-server
cp -r node_server/dist/* build_network/composedb-server
rm -rf build_network/composedb-server/node_modules
rm build_network/composedb-server/package-lock.json

