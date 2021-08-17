import Configurator from "./configurator.js";

export default class gameState_pointer extends Phaser.State {
    constructor() {
        super("gameState_pointer");
    }
//split config methods into separate file, create two gameState files (keyboard, pointer) and import config methods into each.
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

        this.heroConditions();

        this.pointerConditions();
    }

    addControls() {
        this.hero.events.onInputDown.add(()=>{ this.hero.custom.tapped = true; });
        this.hero.events.onInputUp.add(()=>{ this.hero.custom.tapped = false; }, this);
        this.hero.events.onInputOut.add(()=>{ this.hero.custom.tapped = false; }, this);

        //establish pointer
        if(this.game.device.touch) {
            this.pointer = this.game.input.pointer1;
            this.pointer2 = this.game.input.pointer2;
        } else {
            this.pointer = this.game.input.mousePointer;
            this.pointer2 = this.game.input.mousePointer.rightButton;
            this.game.input.mouse.capture = true;
        }
    }

    pointerConditions() {
        this.angle = this.game.physics.arcade.angleToPointer(this.hero);
        this.angleAbove = (this.angle > -1.3 && this.angle < -0.7);
        this.angleBelow = (this.angle > 0.7 && this.angle < 1.3);

        if(this.angle === -1 || this.angle === 1) {//prevents "spinning in place" when pointer is directly between left and right
            this.pointerUp();
        }

        this.dtp = this.game.physics.arcade.distanceToPointer(this.hero, this.pointer, true);
        this.upperlimit = this.hero.body.width*10;
        this.lowerlimit = this.hero.body.width;
        this.pointerDistanceIsCorrect = this.dtp < this.upperlimit && this.dtp > this.lowerlimit;
        
        if(this.pointer.worldX < this.hero.body.x) {
            this.pointerLeft = true;
            this.pointerRight = false;
        } else if(this.pointer.worldX > this.hero.body.x) {
            this.pointerLeft = false;
            this.pointerRight = true;
        }

        if(this.pointer.isDown) {
            this.pointerInput();
        }

        if(this.pointer2.isDown && this.pointer2.duration < 400) {
            this.pointerLeap();
        }

        if(this.pointer.isUp) {
            this.pointerUp();
        }
    }

    heroConditions() {
        this.hero.isOnGround = (this.hero.body.blocked.down || this.hero.body.touching.down || this.hero.body.onFloor());
        this.hero.isBlocked = (this.hero.body.blocked.left || this.hero.body.blocked.right || this.hero.body.touching.left || this.hero.body.touching.right || this.hero.body.onWall());
		this.hero.isAirborne = (!this.hero.isOnGround && !this.hero.custom.isGrabbing && !this.hero.custom.isClimbing);

        if(this.hero.custom.tapped && !this.hero.isGrabbing && this.pointer.duration < 400) {
            this.tapJump();
        }

        if(this.hero.custom.tapped && this.hero.custom.isGrabbing) {
            this.hero.custom.isClimbing = true;
            if(this.hero.custom.whichDirection === "left" && this.hero.custom.grabLeft) {
                this.climbingLeft();
            } else if(this.hero.custom.whichDirection === "right" && this.hero.custom.grabRight) {
                this.climbingRight();
            }
        }

        if(this.hero.isOnGround && this.hero.custom.isJumping) {
            this.hero.custom.isJumping = false;
        }

        if(this.hero.isAirborne && (this.hero.animations.currentAnim.name.includes("idle") || this.hero.animations.currentAnim.name.includes("run"))) {
            this.hero.animations.currentAnim.stop(false, true);
        }
        if(this.hero.isOnGround && this.hero.animations.currentAnim.name.includes("jump")) {
            this.hero.animations.currentAnim.stop(false, true);
        }
    }

    pointerInput() {
        if(!this.hero.custom.tapped && this.hero.isOnGround) {
            if(!this.angleAbove && !this.angleBelow && this.pointerDistanceIsCorrect) {
                if(this.pointerLeft && !this.pointerRight) {
                    this.hero.custom.whichDirection = 'left';
                    this.hero.body.velocity.x = -150;
                    this.hero.animations.play('run-left');
                } else if(this.pointerRight && !this.pointerLeft) {
                    this.hero.custom.whichDirection = 'right';
                    this.hero.body.velocity.x = 150;
                    this.hero.animations.play('run-right');
                }
            } else if(this.angleBelow || this.angleAbove || !this.pointerDistanceIsCorrect) {
                this.pointerUp();
            }
        }
    }

    pointerLeap() {
        if(!this.hero.custom.tapped && !this.hero.custom.isGrabbing) {
            this.hero.custom.isJumping = true;
            this.hero.body.velocity.y = -100;
            if(this.hero.custom.whichDirection === 'left') {
                this.hero.animations.play('jump-left');
            } else if(this.hero.custom.whichDirection === 'right') {
                this.hero.animations.play('jump-right');
            }
            this.unblock();
        }
    }

    unblock() {
        if(this.hero.body.newVelocity.x === 0) {
            this.hero.body.velocity.y-=50;
            if(this.hero.custom.whichDirection === 'left') {
                this.hero.body.velocity.x-=50;
            } else if(this.hero.custom.whichDirection === 'right') {
                this.hero.body.velocity.x+=50;
            }
        }
    }
    
    tapJump() {
        this.hero.custom.isJumping = true;
        this.hero.body.velocity.y = -150;
        if(this.hero.custom.whichDirection === "left") {
            this.hero.animations.play('jump-left');
        } else if(this.hero.custom.whichDirection === "right") {
            this.hero.animations.play('jump-right');
        }
    }

    pointerUp() {
        if(!this.hero.custom.isGrabbing && !this.hero.custom.isClimbing && !this.hero.custom.isJumping) {
            this.hero.body.velocity.x = 0;
            if(this.hero.custom.whichDirection === "left" && this.hero.isOnGround) {
                this.hero.animations.play('idle-left');
            } else if(this.hero.custom.whichDirection === "right" && this.hero.isOnGround) {
                this.hero.animations.play('idle-right');
            }
        }
        this.game.input.reset(true);
    }

    ledgeHit(hero, ledge) {
        if(!hero.custom.isGrabbing && hero.body.velocity.y < 0) {
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
        this.tweenUp.onStart.add(()=>{ this.hero.anchor.y = 0.5; this.hero.input.enabled = false; }, this);
        this.tweenUp.onComplete.add(()=>{ 
            if(this.hero.custom.whichDirection === "left") {
                this.hero.animations.play('roll-left');
            } else if(this.hero.custom.whichDirection === "right") {
                this.hero.animations.play('roll-right'); 
            }
        }, this);
    }

    freeze() {
        this.hero.custom.isGrabbing = true;
        this.hero.custom.isJumping = false;
        this.hero.custom.tapped = false;
        this.hero.input.enabled = true;
        this.hero.body.stop(); //set speed/accel/velo to 0
        this.hero.body.immovable = true; //no impact from other bodies
        this.hero.body.moves = false; //physics system does not move body, but can be moved manually 
        this.hero.body.enable = false; //won't be checked for any form of collision or overlap or have its pre/post updates run.
        this.hero.body.allowGravity = false; //body's local gravity disabled
        this.gravity = 666;
        this.increment = 10;
    }

    unfreeze0() {
        this.hero.body.immovable = false;
        this.hero.body.enable = true;
        this.hero.body.moves = true;  
        this.hero.body.allowGravity = true;
    }

    unfreeze() {
        this.hero.body.reset();
        this.hero.custom.tapped = false;
        this.hero.custom.isGrabbing = false;
        this.hero.custom.isClimbing = false;
        this.hero.input.enabled = true;
        this.hero.body.velocity.x = 0;
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

    render() {
        // this.game.debug.body(this.hero);
        // // this.game.debug.bodyInfo(this.hero, 32, 32);
        // this.game.debug.spriteBounds(this.hero, 'rgba(0,0,255,1)', false);
        // this.mapObjects.ledgesGroup.forEach((ledge)=>{
        //     this.game.debug.body(ledge);
        //     this.game.debug.spriteBounds(ledge, 'rgba(255,0,0,1)', false);
        // })
        // this.mapObjects.endsGroup.forEach((end)=>{
        //     this.game.debug.body(end);
        //     this.game.debug.spriteBounds(end, 'rgba(255,0,0,1)', false);
        // })
    }
}
