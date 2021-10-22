# sunflame_mountain

## Local Install Instructions:
- Uncomment the following line in app.js:
```js
var
// dotenv = require('dotenv').config(),
```
- Run npm install
- Run npm start
- Navigate to localhost:8080

## About The Project

After completing Colt Steele's Web Developer Bootcamp on Udemy, I wanted to build something eye-catching, something that would stand out. So, I took the basic concepts I'd learned from the YelpCamp project in that course and went in my own direction with it. 

I created a short list of features that I wanted the site to have. The list was the roadmap not just for the project, but for my learning process as well. From the beginning, I decided that I would go where the roadmap took me, and I knew that some of the planned features would take me far off the beaten path of what I had already learned. Thanks to the bootcamp, I had already gained a basic understanding of certain features, such as basic REST routing, basic API usage, and the fundamentals of webpage templating. As for the rest... I knew I was about to follow my roadmap into "here be dragons" territory. But I also knew that this was all part of the learning process: research, problem solving, getting creative and staying determined in the face of difficulty. 

This project is the culmination of that process. 

The first step in the process was to build what I already knew: a simple Express app rendering EJS templates and styled with Bootstrap. I built up basic templates for registration, login, a user homepage, a navbar. With the bare-bones site up and running (first on the now-defunct Cloud9 and then on GoormIDE), I followed the YelpCamp example as far as I could, and then it was time to jump into the deep end.

I wanted a platformer game on the site, but there was just one problem: I had never coded a game. I didn't know how to begin the process. I didn't even know what coding languages I could use for game development. But I wanted to have a platformer on the site, so I began to chisel away at the problem, piece by piece. My first Google search on the subject was probably something along the lines of, "How to code a browser game"; and having discovered I could use Javascript for the job, a language I was now passingly familiar with, my next search was something like, "How to code a javascript game". From there I found several Javascript game frameworks, and began the daunting process of deciding which one to focus on. In the end I went with the popular Phaser framework, trusting in its large userbase to deliver tutorials and StackOverflow solutions that a novice like me could learn from.

And finding Phaser was just the beginning. From there, I ultimately chose to switch to Phaser CE/2. Phaser 3 couldn't provide me with the exact gameplay functionality I wanted: its Arcade physics system doesn't handle sloped tiles, and the MatterJS physics system proved to have a known bug that causes sliding on slopes. When my research on implementing slopes in Phaser led me to the ingenious [Phaser CE slopes plugin](https://github.com/hexus/phaser-arcade-slopes) by [@hexus](https://github.com/hexus), the choice was clearcut. 

The next battlefront was the ledge climbing function; inspired by the early Prince of Persia games of my childhood, I envisioned a similar mechanism for climbing ledges in my own game. When a search for existing examples of Javascript-based ledge climb functions came up lacking, I took the matter into my own hands and delved deep into the Phaser CE documentation. It was no simple process, and at each stage it posed one challenge after another. But I refused to give up or settle for less. Step by step, and over the course of several revisions, I built a ledge climb function that delivered the exact functionality I had seen in my mind's eye. 

After that, the next signposts on the roadmap were no less of a new frontier for me: building the customizer and equipper. One that creates or updates the "base" image for a Unicorn, and one that allows the player to decorate the Unicorn and its environment. Both would require image manipulation. Similar concepts, but just different enough to present their own challenges. And the biggest challenge: the two would have to be interlinked. Each would need access to the other's most recent output. When a player updates the equipped items on their Unicorn, the equipper must have access to the most recent "base" image of the Unicorn, with its current colors and markings. And when the player updates the markings or colors on their Unicorn, if that Unicorn has equipped items, the finalized image on the player's profile must show not only the latest markings and colors, but also the latest equipped items. 

Building the customizer and equipper yielded a procession of new learning experiences: KonvaJS for canvas-based image manipulation on the front end, turning the canvas into a blob, using the Fetch API for sending the blob back to the server, using the sharp library server-side to process and composite the raw image data, and uploading that raw data to Cloudinary to create image files and store them.

Just as I'd intended, I went wherever the process took me. I expanded on all the concepts I'd learned, going far beyond the scope of the bootcamps I took, and I even gained experience in contributing to issues on GitHub: I found a bug in the sharp library and in the phaser-arcade-slopes plugin, and participated in correcting both. 

I'm proud of what I have learned with this project and I'm looking forward to learning and building more.

[Check it out on Heroku](https://sunflame-mountain.herokuapp.com/)
