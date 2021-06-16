import Boot from '/build/scripts/states/boot.js';
import Preloader from '/build/scripts/states/preloader.js';
import NPC from '/build/scripts/states/npc.js';
import gameState from '/build/scripts/states/gameState.js';

var gamedoor = document.getElementById('gamedoor');
var magicdoor = document.getElementById('magicdoor');
magicdoor.addEventListener("pointerdown", ()=>{
	gamedoor.replaceChildren();
	var config = {
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		parent: 'gamedoor',
		transparent: false,
		antialias: false,
		crisp: true,
		enableDebug: true,
		maxPointers: 1
	}
	var game = new Phaser.Game(config);

	game.state.add('Boot', Boot);
	game.state.add('Preloader', Preloader);
	game.state.add('NPC', NPC);
	game.state.add('gameState', gameState);

	//	Now start the Boot state.
	game.state.start('Boot');
});
