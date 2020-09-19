rm -rf tmp
mkdir tmp

# manifest
cp -r manifest.json tmp/
# build files
cp -r dist tmp/
# asset files
cp -r assets tmp/

# create zip
zip -r package.zip tmp
