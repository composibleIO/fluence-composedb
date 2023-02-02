rm -rf build_frontend/*
cp -r frontend-demo/public/* build_frontend/

rm -rf build_network/*
cp -r docker/* build_network

mkdir build_network/scripts
cp -r scripts/server/* build_network/scripts/
cp -r scripts/.env* build_network/scripts/

mkdir build_network/aqua
cp aqua/server.aqua build_network/aqua/

cp composedb-cli/tu-cdb build_network