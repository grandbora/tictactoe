define([], function()
{

	var Game = Backbone.Model.extend({

	    initialize : function()
	    {
		    this.id = this.attributes.id;
		    this.players = this.attributes.players;
		    this.selfIndex = globalConfig.me.id == this.attributes.players[0].get('id') ? 0 : 1;

		    this.roomName = "room:" + this.id;

		    this.players[0].mark = "X";
		    this.players[1].mark = "O";
		    this.players[0].style = "player0_cell";
		    this.players[1].style = "player1_cell";
		    this.players[0].scoreEl = "player0_wins";
		    this.players[1].scoreEl = "player1_wins";
		    this.players[0].win = 0;
		    this.players[1].win = 0;

		    this.currentPlayerIndex = 0;
		    this.currentMoveId = 0;
		    this.numOfCols = this.numOfRows = 3;
	    },

	    isMyTurn : function()
	    {
		    return this.currentPlayerIndex == this.selfIndex;
	    },

	    swapTurn : function()
	    {
		    this.currentPlayerIndex = (++this.currentPlayerIndex) % 2;
	    },

	    getCurrentPlayer : function()
	    {
		    return this.players[this.currentPlayerIndex];
	    }

	});

	return Game;
});