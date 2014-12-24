/* == findAndReplace ==
 * (By James Padolsey  http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/)
 *
 * No library or framework is required to use this function, it's entirely stand-alone. The function requires
 * two parameters, the third one is optional:
 *
 * * searchText - This can either be a string or a regular expression. Either way, it will eventually become a
 *   RegExp object. So, if you wanted to search for the word "and" then that alone would not be appropriate - all
 * words that contain "and" would be matched so you need to use either the string, \\band\\b or the regular
 * expression, /\band\b/g to test for word boundaries. (remember the global flag)
 *
 * * replacement - This parameter will be directly passed to the String.replace function, so you can either have
 *  a string replacement (using $1, $2, $3 etc. for backreferences) or a function.
 *
 * * searchNode - This parameter is mainly for internal usage but you can, if you so desire, specify the node
 * under which the search will take place. By default it's set to document.body.
 */


  function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
      // Throw error here if you want...
      return;
    }
    var regex = typeof searchText === 'string' ?
      new RegExp(searchText, 'gi') : searchText,
    childNodes = (searchNode || document.body).childNodes,
    cnLength = childNodes.length,
    excludes = 'html,head,style,title,link,meta,script,object,iframe,textarea';
    while (cnLength--) {
      var currentNode = childNodes[cnLength];
      if (currentNode.nodeType === 1 &&
          (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
        arguments.callee(searchText, replacement, currentNode);
      }
      if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
        continue;
      }
      var parent = currentNode.parentNode,
      frag = (function(){
        var html = currentNode.data.replace(regex, replacement),
        wrap = document.createElement('div'),
        frag = document.createDocumentFragment();
        wrap.innerHTML = html;
        while (wrap.firstChild) {
          frag.appendChild(wrap.firstChild);
        }
        return frag;
      })();
      parent.insertBefore(frag, currentNode);
      parent.removeChild(currentNode);
    }
  }


  function findAndReplaceKB(){
    findAndReplace('\\b(KB\\d{7})\\b',
                   '<a href=\"https://finishline.service-now.com/kb_view.do?sysparm_article=$&\" target=\"_blank\">$&</a>'
    );
  }
  function findAndReplaceINC(){
    findAndReplace('\\b(INC\\d{7})\\b',
                   '<a href=\"https://finishline.service-now.com/textsearch.do?sysparm_no_redirect=true&sysparm_search=$&\" target=\"_blank\">$&</a>'
    );
    //findAndReplace('\\b(INC-\\d{3}-\\d{4})\\b',
                   //'<a href=\"https://finishline.service-now.com/textsearch.do?sysparm_no_redirect=true&sysparm_search=$&\" target=\"_blank\">$&</a>'
    //);
  }

jQuery(document).ready(function(){
  findAndReplaceKB()
  findAndReplaceINC()
})
