import Boot from '/build/scripts/states/boot.js';
import Preloader from '/build/scripts/states/preloader.js';
import NPC from '/build/scripts/states/npc.js';
import UI from '/build/scripts/states/uiState.js';
import gameState from '/build/scripts/states/gameState.js';

var gamedoor = document.getElementById('gamedoor');
var magicdoor = document.getElementById('magicdoor');
magicdoor.addEventListener("pointerdown", ()=>{
	gamedoor.replaceChildren();
	var config = {
		type: Phaser.AUTO,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		parent: 'gamedoor',
		pixelArt: true,
		antialias: false,
		physics: {
			default: 'matter',
			matter: {
				gravity: {y: 3},
				debug: false,
				plugins: {
					attractors: true
				}
			}
		},
	}
	var game = new Phaser.Game(config);

	game.scene.add('Boot', Boot);
	game.scene.add('Preloader', Preloader);
	game.scene.add('NPC', NPC);
	game.scene.add('UI', UI);
	game.scene.add('gameState', gameState);

	//	Now start the Boot state.
	game.scene.start('Boot');
});
