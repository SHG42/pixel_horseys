export default class NPC extends Phaser.State {
    constructor(key) {
        super('NPC');
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this._keyboardIsActive = data.keyboardIsActive;
        this._pointerIsActive = data.pointerIsActive;
        this.loadingLevel = false;
        //emit event to reset if game over occurs and new game starts, check to see if new game
        if(this._NEWGAME) {
            this.newGameSignal = new Phaser.Signal();
            this.newGameSignal.dispatch();
        }
    }

    create() {
        this.addNPC();
        //init anim
        this.portal = this.game.add.sprite(this.camera.view.width/2, this.camera.view.height/2, 'portal', '0000');
        this.portal.anchor = {x: 0.5, y: 0.5};
        this.portal.visible = false;
        this.portalAnim = this.portal.animations.add('portal', Phaser.Animation.generateFrameNames('', 0, 8, '', 4), 7, true, false);
    }

    addNPC() {
		this.NPCdata = this.cache.getJSON('NPCdata');

        if(this._LEVEL === 0) {
            this.bgName = "cutscene1";
            this.NPC_is = this.time.events.add(Phaser.Timer.SECOND * 2, function(){
                this.sorceress = this.game.add.sprite(0, 0, 'sorceress', 'sorceress_smile');
                this.time.events.add(Phaser.Timer.SECOND * 1, this.launch, this);
            }, this);
        } else if(this._LEVEL === 5) {
            this.bgName = "cutscene2";
            this.NPC_is = this.time.events.add(Phaser.Timer.SECOND * 2, function(){
                this.ranger = this.game.add.image(0, 0, "forest_ranger", null);
                this.time.events.add(Phaser.Timer.SECOND * 1, this.launch, this);
            }, this);
        }

        this.bg = this.game.add.image(0, 0, this.bgName, null);
        if(this.game.width < this.game.height) { //portrait
            this.bg.anchor.x = 0.5;
        }
    }

    launch() {
        this.bar = this.game.add.graphics();
        this.bar.beginFill(0xffffff, 0.8);
        this.bar.drawRect(0, this.camera.view.height-200, this.camera.view.width, 200);

        this.text = this.game.add.text(0, 0, "", { font: "bold 20px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.camera.view.width-150 });
        this.text.setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);
        this.text.setTextBounds(0, this.camera.view.height-200, this.camera.view.width-100, 200);

        this.next = this.game.add.image(this.camera.view.width-50, this.camera.view.height-50, "forward", null);
        this.next.visible = false;

        this.runDialogue();
    }
    
    runDialogue() {
        this.wordIndex = 0; //the index of the word in the line
        this.lineIndex = 0; //the index of the line in the dialogue array

        this.wordDelay = 220;
        this.lineDelay = 3000;

        if(this.NPC_is.callbackContext.sorceress) {
            this.dialogue = this.NPCdata.sorceress.dialogue;
            this.processText();
        } else if(this.NPC_is.callbackContext.ranger) {
            this.dialogue = this.NPCdata.ranger.dialogue;
            this.processText();
        }
    }

    processText() {
        this.concatenate(this.dialogue[0])
        this.runline = this.next.events.onInputDown.add(()=>{
            this.text.text = "";
            this.lineIndex++;
            if(this.lineIndex < this.dialogue.length) {
                this.concatenate();
            } else {
                this.bar.destroy();
                this.text.destroy();
                this.next.destroy();
                this.bg.destroy();
                if(this.NPC_is.callbackContext.sorceress) {
                    this.runPortal();
                } else if(this.NPC_is.callbackContext.ranger) {
                    this.runEnd();
                }
            }
        }, this);
    }

    concatenate() {
        if(this.NPC_is.callbackContext.sorceress) {
            this.switchEmote();
        }
        this.words = this.dialogue[this.lineIndex].text.split(" ");
        this.words.forEach((word, i)=>{
            if(i < this.words.length) {
                this.concatTimer = this.game.time.events.add(i * this.wordDelay, ()=>{
                    this.next.visible = false;
                    this.next.inputEnabled = false;
                    this.wordIndex++;
                    this.text.text = this.text.text.concat(this.words[i]) + " ";
                }, this);
            }
        })
        this.concatTimer.timer.onComplete.addOnce(()=>{
            this.next.visible = true;
            this.next.inputEnabled = true;
            this.runLine;
        }, this);
    }

    switchEmote() {
        this.sorceress.loadTexture('sorceress', this.dialogue[this.lineIndex].emote);
    }

    runPortal() {
        this.sorceress.destroy();
        this.portal.visible = true;
        this.portalAnim.play('portal');
        setTimeout(() => {
            this.game.camera.fade(0x000000, 2000);
            this.game.camera.onFadeComplete.add(this.startGame, this);
        }, 4000);
    }

    runEnd() {
        this.ranger.destroy();
        this.game.camera.fade(0x000000, 2000);
        this.game.camera.onFadeComplete.add(()=>{
			this.game.pendingDestroy = true;
			win();
		}, this);
    }

    startGame() {
        var data = {level: 1, newGame: true, levels: this._LEVELS, keyboardIsActive: this._keyboardIsActive, pointerIsActive: this._pointerIsActive}
        this.state.start('gameState', true, false, data);
    }
}

async function win() {
	let response = await fetch('/explore', {
		method: 'PUT',
		redirect: "follow",
		body: "win"
	});
	let result = await response;
	if(result.ok) {
		window.location = "/index";
	}
}