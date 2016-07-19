ready(function () {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // foundation -- these could be in a library, or you might use a library with some glue for the
  // memoization and returning a task.  I chose to implement as a demonstration that I didn't need ALL
  // of jQuery for some simple work

  // This could be a foundation piece.  It would be common to want a page element
  // Chose to memoize this, which has runtime implications if your code radically alters the DOM
  // Could also just use a library like jQuery
  // This is also impure because the result depends on the DOM state
  var Dom = {
    // Dom.getElById :: Id -> Element
    getElById: R.memoize(function (id) {
      return document.getElementById(id);
    })
  }

  // This could be a foundation piece.  It would be common to want the GET response from a url
  // This is standard XMLHttpRequest usage, except returning a Task
  // Could also just use a library like jQuery
  // The get function is pure, returning a Task.  When forked, the Task accomplishes impure things
  var Http = {
    // Http.get :: Url -> Task Error String
    get: function (url) {
      return new Task(function (reject, resolve) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
              resolve(this.responseText);
            } else {
              reject('Error for URL: ' + url + '. StatusText: ' + this.statusText);
            }
          }
        };

        request.send();
        request = null;
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // --- pure functions

  // extractName :: [JSON] -> [Names]
  // pure - will always get same names from same JSON
  var extractName =  compose(map(R.prop('name')));

  // makeRequest :: Url -> Task Error [Names]
  // pure - returns a task that will execute against the input URL
  var makeRequest = compose(map(extractName), map(JSON.parse), Http.get);
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // --- impure functions

  // getTargetUrl :: Id -> String
  // impure - resulting string depends on initial DOM element id
  var getTargetUrl = compose(R.prop('value'), Dom.getElById);

  // and as expected, based on some action in the impure world (an event), run the composed Task
  function handleRequest() {
    Dom.getElById('error').textContent = '';
    Dom.getElById('results').textContent = '';
    
    var targetUrl = getTargetUrl('targetUrl');

    // execute the task, and do something based on success or failure
    // when the task fails, note that the remaining functions in the composition are
    // not executed, and do not get a chance to blow up, all without special branching
    // logic.  The short-circuit just happens.
    makeRequest(targetUrl).fork(
      function fail (x) {
        Dom.getElById('error').textContent = x;
      },
      function success (x) {
        Dom.getElById('results').textContent = x;
      }
    );
  }

  // handleRequest fires off the composition, so put that on a trigger here
  document.getElementById('submitUrl').addEventListener('click', handleRequest);

});