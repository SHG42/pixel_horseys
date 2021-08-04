export default class addHero {
    constructor(game, Phaser, map, mapObjects) {
        //iterate over available entrances
        mapObjects.entrancesGroup.forEach(entrance => {
            // if (entrance.name === 'test') {
            //     this.hero = game.make.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
            // }

            if (this._NEWGAME && this._LEVEL === 1) {
                //if newGame = true and loaded level is lvl1, load character at lvl1 starting pt
                if (entrance.name === 'stage1entry') { //change back to stage1entry after testing
                    this.hero = game.make.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
                }
            } else if (!this._NEWGAME && this._LEVEL === 1) {
                if (entrance.name === 'portalfromcave') {
                    //if returning from cave, load sprite at return pt
                    this.hero = game.make.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
                }
            } else { //otherwise, use whatever coordinates come back when function runs
                this.hero = game.make.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
            }
        });

        //add hero to sorting group
        map.sortGroup.add(this.hero);
        map.sortGroup.sendToBack(this.hero);
        if (this._LEVEL === 4) {
            map.sortGroup.sendToBack(mapObjects.goal);
        }

        game.physics.arcade.enable(this.hero);
        this.hero.body.bounce.y = 0.3;
        this.hero.body.collideWorldBounds = true;
        this.hero.body.setSize(this.hero.body.halfWidth - 10, this.hero.body.height - 5, 18, 3);
        this.hero.inputEnabled = true;
        this.hero.hitArea = this.hero.body.width * this.hero.body.height;
        //enable hero for slopes
        game.slopes.enable(this.hero);
        // Prefer the minimum Y offset for this physics body
        this.hero.body.slopes.preferY = true;
        // Pull the player into downwards collisions with a velocity of 50
        this.hero.body.slopes.pullDown = 50;
        //set custom properties
        this.hero.custom = {
            whichDirection: 'right',
            isGrabbing: false,
            grabLeft: false,
            grabRight: false,
            isClimbing: false,
            isJumping: false,
            tapped: false
        };

        this.createAnims(game, Phaser, this.hero);
    }

    createAnims(game, Phaser, hero) {
        this.hero = hero;
        //idle
        this.idleRight = this.hero.animations.add('idle-right', Phaser.Animation.generateFrameNames('idle-right-', 0, 3, '-1.3', 2), 2, true, false);
        this.idleLeft = this.hero.animations.add('idle-left', Phaser.Animation.generateFrameNames('idle-left-', 0, 3, '-1.3', 2), 2, true, false);
    
        //run
        this.runRight = this.hero.animations.add('run-right', Phaser.Animation.generateFrameNames('run-right-', 0, 5, '-1.3', 2), 10, true, false);
        this.runLeft = this.hero.animations.add('run-left', Phaser.Animation.generateFrameNames('run-left-', 0, 5, '-1.3', 2), 10, true, false);
    
        //jump
        this.jumpRight = this.hero.animations.add('jump-right', Phaser.Animation.generateFrameNames('jump-right-', 0, 5, '-1.3', 2), 10, false, false);
        this.jumpLeft = this.hero.animations.add('jump-left', Phaser.Animation.generateFrameNames('jump-left-', 0, 5, '-1.3', 2), 10, false, false);
    
        //grab
        this.grabLeft = this.hero.animations.add('grab-left', Phaser.Animation.generateFrameNames('crnr-grb-left-', 0, 3, '-1.3', 2), 3, true, false);
        this.grabRight = this.hero.animations.add('grab-right', Phaser.Animation.generateFrameNames('crnr-grb-right-', 0, 3, '-1.3', 2), 3, true, false);
    
        //climb
        this.climbLeft = this.hero.animations.add('climb-left', Phaser.Animation.generateFrameNames('crnr-clmb-left-', 0, 4, '-1.3', 2), 10, false, false);
        this.climbRight = this.hero.animations.add('climb-right', Phaser.Animation.generateFrameNames('crnr-clmb-right-', 0, 4, '-1.3', 2), 10, false, false);

        //roll
        this.rollLeft = this.hero.animations.add('roll-left', Phaser.Animation.generateFrameNames('smrslt-left-', 0, 3, '-1.3', 2), 10, true, false);
        this.rollRight = this.hero.animations.add('roll-right', Phaser.Animation.generateFrameNames('smrslt-right-', 0, 3, '-1.3', 2), 10, true, false);

        //up from roll
        this.slideLeft = this.hero.animations.add('slide-left', Phaser.Animation.generateFrameNames('slide-left-', 0, 4, '-1.3', 2), 10, false, false);
        this.slideRight = this.hero.animations.add('slide-right', Phaser.Animation.generateFrameNames('slide-right-', 0, 4, '-1.3', 2), 10, false, false);

        //drop vertically
        this.fallLeft = this.hero.animations.add('fall-left', Phaser.Animation.generateFrameNames('fall-left-', 0, 1, '-1.3', 2), 10, false, false);
        this.fallRight = this.hero.animations.add('fall-right', Phaser.Animation.generateFrameNames('fall-right-', 0, 1, '-1.3', 2), 10, false, false);
                
        //play 'idle-right' by default
        this.hero.animations.play('idle-right');

        //jump 
        this.jumpLeft.onComplete.add(()=>{ this.hero.custom.isJumping = false; this.hero.animations.play('idle-left'); });
        this.jumpRight.onComplete.add(()=>{ this.hero.custom.isJumping = false; this.hero.animations.play('idle-right'); });

        ////LEFT-HAND ROLL
        this.rollLeft.onStart.add(()=>{
            this.end = game.state.callbackContext.end;
            this.gravity = game.state.callbackContext.gravity;
            this.increment = game.state.callbackContext.increment;
            game.state.callbackContext.unfreeze0();
            this.hero.body.gravity.x = -this.gravity;
        }, this);

        this.rollLeft.onLoop.add(()=>{
            game.physics.arcade.moveToObject(this.hero, this.end);
            if(this.hero.body.gravity.x < 0) {
                this.hero.body.gravity.x = this.hero.body.gravity.x+this.increment;
            };
            console.log("loop");
            if(game.physics.arcade.collide(this.hero, this.end)) {
                this.rollLeft.stop(false, true);
            } else if(this.hero.body.blocked.left || this.hero.body.touching.left || this.hero.body.position.x <= this.end.body.position.x) {
                this.rollLeft.stop(false, true);
            }
        }, this);

        this.rollLeft.onComplete.add(()=> { this.hero.animations.play('slide-left'); }, this);

        this.slideLeft.onComplete.add(()=>{ this.hero.body.speed = 0; game.state.callbackContext.unfreeze(); if(this.hero.body.gravity.x < 0) { this.hero.body.gravity.x =  0 }; }, this);

        this.climbLeft.onStart.add(()=>{ 
            game.state.callbackContext.tweenUp.start();
        }, this);

        ////RIGHT-HAND ROLL
        this.rollRight.onStart.add(()=>{
            this.end = game.state.callbackContext.end;
            this.gravity = game.state.callbackContext.gravity;
            this.increment = game.state.callbackContext.increment;
            game.state.callbackContext.unfreeze0();
            this.hero.body.gravity.x = this.gravity;
        }, this);
        
        this.rollRight.onLoop.add(()=>{
            game.physics.arcade.moveToObject(this.hero, this.end);
            if(this.hero.body.gravity.x > 0) { 
                this.hero.body.gravity.x = this.hero.body.gravity.x-this.increment;
            };
            if(game.physics.arcade.collide(this.hero, this.end)) {
                this.rollRight.stop(false, true);
            } else if(this.hero.body.blocked.right || this.hero.body.touching.right || this.hero.body.position.x >= this.end.body.position.x) {
                this.rollRight.stop(false, true);
            }
        }, this);
        
        this.rollRight.onComplete.add(()=> { this.hero.animations.play('slide-right'); }, this);
        
        this.slideRight.onComplete.add(()=>{ this.hero.body.speed = 0; game.state.callbackContext.unfreeze(); if(this.hero.body.gravity.x > 0) { this.hero.body.gravity.x = 0 }; }, this);
        
        this.climbRight.onStart.add(()=>{
            game.state.callbackContext.tweenUp.start();
        }, this);
    }
}