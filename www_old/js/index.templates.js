let IndexTemplate = `
		<% if (apps.length == 0) { %>
		<h2 class="bh2">You don't have any installed apps yet. You can install one from App Center</h2>
		<a href="appcenter.html" class="appcenterh">App Center</a>
    <% } %>

    <%for (s=0; s < apps.length; s++) {
        var app = apps[s]; %>

				<% if (app.id != "store" && app.id != "settings") { %>
				<a href="app.html?app_id=<%= app.id %>" class="colapp app">
					<img src="<%= app.icon %>" class="appimg">
					<div class="appname"><span class="withline"><%= app.name %></span></div>
					<div class="appdesc"></div>
				</a>
				<% } %>

    <% } %>`;

module.exports = {
  IndexTemplate
};
