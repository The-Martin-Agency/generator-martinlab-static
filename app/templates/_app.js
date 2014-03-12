// if you need your own name space
var <% _.slugify(projectName) %> = <% _.slugify(projectName) %> || {};

<% if(includeJquery){%>
//shortcut for document ready
(function(){

})(jQuery);
<% } %>
