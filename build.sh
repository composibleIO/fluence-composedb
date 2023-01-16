rm -rf build_frontend/*
cp -r frontend/public/* build_frontend/

rm -rf build_network/*
cp -r docker/* build_network

cp composedb-cli/tu_cdb build_network