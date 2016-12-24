mkdir src
mkdir obj
copy lib\firstclass_ramda.js obj /y
del obj\browserified_folktale.js
browserify ./lib/require_folktale.js -o ./obj/browserified_folktale.js
