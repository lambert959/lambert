#! /bin/bash

# build the program
cd default
make

# package
cd ../
zip pkg/PosDemo.aip -r -x default/* -@ < pkginfo && zip pkg/PosDemo.aip default/PosDemo -j

# Install into the remoet device
~/sdk/xcb connect 127.0.0.1:5555
~/sdk/xcb installer aip pkg/PosDemo.aip
