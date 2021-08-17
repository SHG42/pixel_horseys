import Boot from '/build/scripts/states/boot.js';
import Preloader from '/build/scripts/states/preloader.js';
import controlConfigure from '/build/scripts/states/controlConfigure.js';
import NPC from '/build/scripts/states/npc.js';
import gameState_pointer from '/build/scripts/states/gameState_pointer.js';
import gameState_keyboard from '/build/scripts/states/gameState_keyboard.js';

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
		enableDebug: false,
		maxPointers: 2,
		clearBeforeRender: false
	}
	var game = new Phaser.Game(config);

	game.state.add('Boot', Boot);
	game.state.add('Preloader', Preloader);
	game.state.add('controlConfigure', controlConfigure);
	game.state.add('NPC', NPC);
	game.state.add('gameState_pointer', gameState_pointer);
	game.state.add('gameState_pointer', gameState_pointer);
	game.state.add('gameState_keyboard', gameState_keyboard);

	//	Now start the Boot state.
	game.state.start('Boot');
});
