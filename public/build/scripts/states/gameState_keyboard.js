import Configurator from "./configurator.js";

export default class gameState_keyboard extends Phaser.State {
    constructor() {
        super("gameState_keyboard");
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        //emit event to reset if game over occurs and new game starts, check to see if new game
        if(this._NEWGAME) {
            this.newGameSignal = new Phaser.Signal();
            this.newGameSignal.dispatch();
        }
    }
    
    create() {
        this.Configurator = new Configurator(this.game, Phaser);

        this.hero = this.Configurator.hero.hero;
        this.map = this.Configurator.map;
        this.mapObjects = this.Configurator.mapObjects;

        this.addControls();
    }

    update() {
        //fade out and restart level if sprite falls outside world bounds y
        if (this.hero.body.position.y > this.map.map.heightInPixels) {
            this.game.camera.fade(0x000000, 2000);
            this.game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
        }

        //platform collider
        this.game.physics.arcade.collide(this.hero, this.map.mapLayer);
    
        // run endgame function
        this.game.physics.arcade.overlap(this.hero, this.mapObjects.goal, this.onGoal, null, this);
    
        // run ledge finding function
        this.game.physics.arcade.overlap(this.hero, this.mapObjects.ledgesGroup, this.ledgeHit, null, this);
    
        //run portal function
        this.game.physics.arcade.overlap(this.hero, this.mapObjects.exitsGroup, this.exitStage, null, this);
    
        //run loot get function
        this.game.physics.arcade.overlap(this.hero, this.mapObjects.objectsGroup, this.getLoot, null, this);

        this.updateConditions();
    }

    addControls() {
        this.hero.input.enabled = false;
        //establish keyboard
        //initiate cursor keys
        this.controls = this.game.input.keyboard.createCursorKeys();
        //add special controls for grab and climb
        this.grabKey = this.game.input.keyboard.addKey(71); //'G'
        this.climbKey = this.game.input.keyboard.addKey(67); //'C'

        this.game.input.keyboard.addKeyCapture([37, 38, 39, 40 ]);

        //anim-specific settings
        this.controls.left.onUp.add(()=> {
            if(!this.hero.custom.isGrabbing) {
                this.hero.animations.play('idle-left');
            }
        }, this);
        this.controls.right.onUp.add(()=> { 
            if(!this.hero.custom.isGrabbing) {
                this.hero.animations.play('idle-right'); 
            }
        }, this);
        this.controls.up.onUp.add(()=>{ this.hero.custom.isJumping = false; });

        this.controls.left.onDown.add(()=> { this.hero.custom.whichDirection = 'left' }, this);
        this.controls.right.onDown.add(()=> { this.hero.custom.whichDirection = 'right' }, this);
    }

    updateConditions() {
        this.hero.isOnGround = (this.hero.body.touching.down || this.hero.body.onFloor());
		this.hero.isAirborne = (!this.hero.isOnGround && !this.hero.custom.isGrabbing && !this.hero.custom.isClimbing);

        this.hero.body.velocity.x = 0;
        //Running anims
        if(this.controls.up.isUp && this.hero.isOnGround && !this.hero.custom.isGrabbing) {
            if (this.controls.left.isDown && this.controls.right.isUp) {
                this.hero.body.velocity.x = -150;
                this.hero.animations.play('run-left');
            } else if (this.controls.right.isDown && this.controls.left.isUp) {
                this.hero.body.velocity.x = 150;
                this.hero.animations.play('run-right');
            }
        }

        if(this.controls.up.isDown && (this.hero.animations.currentAnim.name.includes("idle") || this.hero.animations.currentAnim.name.includes("run"))) {
            this.hero.animations.currentAnim.stop(false, true);
        }

        //Jumping
        if (this.controls.up.justDown && this.hero.isOnGround && !this.hero.custom.isGrabbing) {
            this.hero.custom.isJumping = true;
            this.hero.body.velocity.y = -365;
            if(this.hero.body.velocity.y < -365) {
                this.hero.body.velocity.y = -365;
            }
        }

        if(this.controls.left.isUp && this.controls.right.isUp && !this.hero.custom.isGrabbing) {
            if (this.hero.custom.isJumping && this.hero.custom.whichDirection == "left") {
                this.hero.body.velocity.x = 0;
                this.hero.animations.play('jump-left');
            } else if (this.hero.custom.isJumping && this.hero.custom.whichDirection == "right") {
                this.hero.body.velocity.x = 0;
                this.hero.animations.play('jump-right');
            }
        }

        if(this.hero.custom.whichDirection == "left" && this.hero.custom.isJumping && !this.hero.custom.isGrabbing && this.controls.left.isDown && this.controls.right.isUp) {
            this.hero.body.velocity.x = -190;
            this.hero.animations.play('jump-left');
        } else if(this.hero.custom.whichDirection == "right" && this.hero.custom.isJumping && this.controls.right.isDown && this.controls.left.isUp) {
            this.hero.body.velocity.x = 190;
            this.hero.animations.play('jump-right');
        }

        if(this.climbKey.justDown && this.hero.custom.isGrabbing) {
            this.hero.custom.isClimbing = true;
            if(this.hero.custom.whichDirection === "left" && this.hero.custom.grabLeft) {
                this.climbingLeft();
            } else if(this.hero.custom.whichDirection === "right" && this.hero.custom.grabRight) {
                this.climbingRight();
            }
        }

        if(this.hero.custom.isGrabbing && (this.hero.animations.currentAnim.name.includes("idle") || this.hero.animations.currentAnim.name.includes("run") || this.hero.animations.currentAnim.name.includes("jump"))) {
            this.hero.animations.currentAnim.stop(false, true);
        }
    }

    ledgeHit(hero, ledge) {
        if(this.grabKey.isDown) {
            this.hero.custom.isGrabbing = true;
            this.hero.animations.currentAnim.stop(false, true);
            this.goUpBy = ledge.body.y - 13;
            this.getEndpoint(ledge);

            if (ledge.side === "left" && hero.custom.whichDirection === "left") {
                this.hero.animations.play('grab-left');
                hero.custom.grabLeft = true;
                hero.alignIn(ledge, Phaser.TOP_LEFT, 15, 5); //offset accounts for sprite bounding box
                hero.body.position.setTo(ledge.body.x, ledge.body.y);
                this.freeze();
            }
            if (ledge.side === "right" && hero.custom.whichDirection === "right") {
                this.hero.animations.play('grab-right');
                hero.custom.grabRight = true;
                hero.alignIn(ledge, Phaser.TOP_RIGHT, 15, 5); //offset accounts for sprite bounding box
                hero.body.position.setTo(ledge.body.x, ledge.body.y);
                this.freeze();
            }
        }
    }

    getEndpoint(ledge) {
        this.mapObjects.endsGroup.forEach((end)=>{
            if(end.id === ledge.end) {
                this.end = end;
                return this.end;
            }
        });
    }

    climbingLeft() { 
        this.addTweenUp();
        this.hero.input.enabled = false;
        this.hero.animations.play('climb-left');
    }

    climbingRight() {
        this.addTweenUp();
        this.hero.input.enabled = false;
        this.hero.animations.play('climb-right');
    }

    addTweenUp() {
        this.tweenUp = this.game.add.tween(this.hero).to({ y: this.goUpBy }, 1000, 'Circ.easeOut');
        this.tweenUp.onStart.add(()=>{ this.hero.anchor.y = 0.5; this.game.input.keyboard.enabled = false; }, this);
        this.tweenUp.onComplete.add(()=>{
            if(this.hero.custom.whichDirection === "left") {
                this.hero.animations.play('roll-left');
            } else if(this.hero.custom.whichDirection === "right") {
                this.hero.animations.play('roll-right'); 
            }
        }, this);
    }

    freeze() {
        this.hero.custom.isJumping = false;
        this.hero.body.stop(); //set speed/accel/velo to 0
        this.hero.body.immovable = true; //no impact from other bodies
        this.hero.body.moves = false; //physics system does not move body, but can be moved manually 
        this.hero.body.enable = false; //won't be checked for any form of collision or overlap or have its pre/post updates run.
        this.hero.body.allowGravity = false; //body's local gravity disabled
        this.gravity = 8742;
    }

    unfreeze0() {
        this.hero.body.immovable = false;
        this.hero.body.enable = true;
        this.hero.body.moves = true;
        this.hero.body.allowGravity = true;
    }

    unfreeze() {
        this.game.input.keyboard.enabled = true;
        this.hero.body.reset();
        this.hero.body.stop();
        this.hero.custom.isGrabbing = false;
        this.hero.custom.isClimbing = false;
        if(this.hero.custom.whichDirection === "left") {
            this.hero.animations.play('idle-left');
        } else if(this.hero.custom.whichDirection === "right") {
            this.hero.animations.play('idle-right');
        }
    }
    
    onGoal(hero, goal) {
        this.game.camera.fade(0x000000, 2000);
        this.game.camera.onFadeComplete.add(()=>{
            //launch end cutscene
            var data = {level: 5, newGame: false, levels: this._LEVELS}
            this.game.state.start('NPC', true, false, data);
        }, this);
    }
    
    getLoot(hero, loot) {
        loot.destroy();
        var gotLootSignal = new Phaser.Signal();
        gotLootSignal.dispatch();
    }
    
    exitStage(hero, portal) {
        if (portal.name === 'portaltocave') {
            this.game.state.restart(true, false, { level: 2, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltotree') {
            this.game.state.restart(true, false, { level: 3, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltocottage') {
            this.game.state.restart(true, false, { level: 4, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltobridge') {
            this.game.state.restart(true, false, { level: 1, levels: this._LEVELS, newGame: false });
        }
    }
    
    resetFade() {
        this.game.camera.resetFX();
    }
}
