export default class NPC extends Phaser.Scene {
    constructor(key) {
        super('NPC');
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this.loadingLevel = false;
        //emit event to reset if game over occurs and new game starts, check to see if new game
        if(this._NEWGAME) {
            this.events.emit('newGame');
        }
    }

    create() {
        this.time.delayedCall(2000, this.addNPC, [], this);

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        //init anim
        this.portal = this.add.sprite(this.width/2, this.height/2, 'portal', '0000');
        this.portal.anchor = {x: 0.5, y: 0.5};
        this.portal.visible = false;
        this.portalAnim = this.portal.anims.create({
            key: 'portalAnim',
            frames: this.anims.generateFrameNames('portal', {
                start: 0,
                end: 8,
                zeroPad: 4
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    addNPC() {
		this.NPCdata = this.cache.json.get('NPCdata');
        
        if(this._LEVEL === 0) {
            this.bg = this.add.image(0,0, "cutscene1", null);
            this.sorceress = this.add.image(this.bg.width/3,0, 'sorceress', 'sorceress_smile', {isStatic: true});
            this.NPC_is = this.sorceress;
            this.launch();
        } else if(this._LEVEL === 5) {
            this.bg = this.add.image(0,0, "cutscene2", null);
            this.ranger = this.add.image(this.bg.width/3,0, "forest_ranger", null);
            this.NPC_is = this.ranger;
            this.launch();
        }
        this.bg.setOrigin(0,0);
        //  Center the sprite to the picture
        Phaser.Display.Align.In.BottomLeft(this.NPC_is, this.bg, 0, -(this.NPC_is.height/2));
    }

    launch() {
        this.bg.setDepth(0);
        this.NPC_is.setDepth(1);

        this.graphic = this.add.graphics();
        this.graphic.fillStyle(0xffffff, 0.8).fillRect(0,0, this.bg.width-100, this.height/4).setDepth(2);
        
        var style = {
            font: "20px Arial bold",
            color: '#000',
            align: 'center',
            wordWrap: { width: this.width-200 },
            shadow: {
                color: 'rgba(0,0,0,0.8)',
                fill: true,
                offsetX: 1,
                offsetY: 1,
                blur: 2
            }
        };
        
        this.text = this.add.text(0,0, 'Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder', style);
        this.text.setPadding({ x: 16, y: 16 }).setDepth(3);

        this.next = this.add.image(0,0, "forward");
        this.next.setInteractive(this.next.width*this.next.height);
        this.next.on("pointerdown", this.runLine, this);
        this.next.input.enabled = false;
        // this.next.visible = false;
        this.next.setDepth(4);

        // this.runDialogue();
    }

    runLine() {
        this.text.text = "";
        this.lineIndex++;
        if(this.lineIndex < this.dialogue.length) {
            this.concatenate();
        } else {
            this.bar.destroy();
            this.text.destroy();
            this.next.destroy();
            this.bg.destroy();
            if(this.NPC_is.texture.key === "sorceress") {
                this.runPortal();
            } else if(this.NPC_is.texture.key === "ranger") {
                this.runEnd();
            }
        }
    }
    
    runDialogue() {
        this.wordIndex = 0; //the index of the word in the line
        this.lineIndex = 0; //the index of the line in the dialogue array

        this.wordDelay = 220;
        this.lineDelay = 3000;

        if(this.NPC_is.texture.key === "sorceress") {
            this.dialogue = this.NPCdata.sorceress.dialogue;
            this.concatenate(this.dialogue[0]);
        } else if(this.NPC_is.texture.key === "ranger") {
            this.dialogue = this.NPCdata.ranger.dialogue;
            this.concatenate(this.dialogue[0]);
        }
    }

    concatenate() {
        if(this.NPC_is.texture.key === "sorceress") {
            this.switchEmote();
        }
        this.words = this.dialogue[this.lineIndex].text.split(" ");
        this.words.forEach((word, i)=>{
            if(i < this.words.length) {
                this.concatTimer = this.time.delayedCall(i * this.wordDelay, ()=>{
                    this.next.visible = false;
                    this.next.input.enabled = false;
                    this.wordIndex++;
                    this.text.text = this.text.text.concat(this.words[i]) + " ";
                }, this);
            }
        })
        
        if (this.concatTimer.elapsed == this.concatTimer.delay) {
            this.next.visible = true;
            this.next.input.enabled = true;
            this.runLine;
        }
    }

    switchEmote() {
        this.sorceress.setTexture('sorceress', this.dialogue[this.lineIndex].emote);
    }

    runPortal() {
        this.sorceress.destroy();
        this.portal.visible = true;
        this.anims.play('portal');
        setTimeout(() => {
            this.camera.fade(0x000000, 2000);
            this.camera.onFadeComplete.add(this.startGame, this);
        }, 4000);
    }

    runEnd() {
        this.ranger.destroy();
        this.camera.fade(0x000000, 2000);
        this.camera.onFadeComplete.add(()=>{
			this.pendingDestroy = true;
			win();
		}, this);
    }

    startGame() {
        var data = {level: 1, newGame: true, levels: this._LEVELS}
        this.state.start('gameState', data);
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