module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Server Things (Bashy)",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Server Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Member Online Count', 'Member Count', 'Role Count', 'Text Channel Count', 'Voice Channel Count'];
	return `${servers[parseInt(data.server)]} - ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Bashy",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.8.2",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Stores more Server Information",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	const info = parseInt(data.info);
	let dataType = 'Text';
	switch(info) {
		case 0:
			dataType = "Number";
			break;
		case 1:
			dataType = "Number";
			break;
		case 2:
			dataType = "Number";
			break;
		case 3:
			dataType = "Number";
			break;
		case 4:
			dataType = "Number";
			break;
	}
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["server", "varName", "info", "storage", "varName2"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions.
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information,
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use.
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by Bashy!
		</p>
	</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Member Online Count</option>
			<option value="1">Member Count</option>
			<option value="2">Role Count</option>
			<option value="3">Text Channel Count</option>
			<option value="4">Voice Channel Count</option>
			</select>
	</div>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	glob.serverChange(document.getElementById('server'), 'varNameContainer')
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const server = parseInt(data.server);
	const varName = this.evalMessage(data.varName, cache);
	const info = parseInt(data.info);
	const targetServer = this.getServer(server, varName, cache);
	if(!targetServer) {
		this.callNextAction(cache);
		return;
	}
	let result;
	switch(info) {
		case 0:
			result = targetServer.presences.size;
			break;
		case 1:
			result = targetServer.memberCount;
			break;
		case 2:
			result = targetServer.roles.size;
			break;
		case 3:
			result = targetServer.channels.findAll('type', 'text').length;
			break;
		case 4:
			result = targetServer.channels.findAll('type', 'voice').length;
			break;
		default:
			break;
	}
	if(result !== undefined) {
		const storage = parseInt(data.storage);
		const varName2 = this.evalMessage(data.varName2, cache);
		this.storeValue(result, storage, varName2, cache);
	}
	this.callNextAction(cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module
