mkdir src
mkdir obj
copy lib\firstClass_ramda.js obj /y
del obj\browserSafe_folktale.js
browserify ./lib/browserify_folktale.js -o ./obj/browserSafe_folktale.js