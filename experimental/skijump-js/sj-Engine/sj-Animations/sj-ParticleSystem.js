
SJ.Particle =
class {
    constructor(position) {
        this.acceleration = createVector(0, 0.05);
        this.velocity = createVector(random(-1, 1), random(-1, 0));
        this.position = position.copy();
        this.lifeTime = 1.0;
        this.lifeLeft = this.lifeTime;
        this.dyingSpeed = 0.02;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifeLeft -= this.dyingSpeed;
    }

    draw() {
        stroke(200, (this.lifeLeft / this.lifeTime) * 255);
        strokeWeight(2);
        fill(127, (this.lifeLeft / this.lifeTime) * 255);
        ellipse(this.position.x, this.position.y, 12, 12);
    }

    isDead() {
        return this.lifeLeft < 0;
    }
}

SJ.ParticleSystem =
class {
    constructor(position) {
        this.origin = position.copy();
        this.particles = [];
        this.Particle = SJ.Particle
    }

    addParticle(position=createVector(0, 0)) {
        this.particles.push(new this.Particle(position));
    }

    draw() {
        push();
            translate(this.origin.x, this.origin.y)
            for (let i = this.particles.length-1; i >= 0; i--) {
                let p = this.particles[i];
                p.update();
                if (p.isDead()) {
                    this.particles.splice(i, 1);
                }else {
                    p.draw();
                }
            }
        pop();
    }
}

SJ.WindParticleSystem =
class extends SJ.ParticleSystem {
    constructor() {
        super(createVector(0, 0));

        this.Particle = class extends SJ.Particle {
            constructor(position) {
                super(position)
                this.dyingSpeed = 0.08;

                this.color = ([
                    { r: 25, g: 20, b: 10 },
                    { r: 138, g: 131, b: 127 },
                    { r: 90, g: 100, b: 50 },
                    { r: 71, g: 66, b: 56 }
                ])[floor(random() * 4)];

                this.acceleration = createVector(
                    -7 + random(-3, 3), 
                    1 + random(-2, 2)
                );
                
                this.weight = random() * 3.0
            }

            draw() {
                strokeWeight(this.weight);
                const { r, g, b } = this.color;
                stroke(r, g, b);
                push();
                    translate(this.position.x, this.position.y);
                    const lengthMult = 0.05 * this.weight;
                    line(0, 0, lengthMult*this.velocity.x, lengthMult*this.velocity.y)
                pop();
            }
        }

        for(let i=0; i<300; i++) {
            this.addParticle();
        }
    }

    addParticle() {
        super.addParticle(createVector(
            random() * (SJ.SCREEN_WIDTH + 200),
            random() * (SJ.SCREEN_HEIGHT + 200) - 200
        ));

        super.addParticle(createVector(
            random() * (SJ.SCREEN_WIDTH + 200),
            random() * (SJ.SCREEN_HEIGHT + 200) - 200
        ));
    }

    draw() {
        for(let i=0; i<20; i++) {
            this.addParticle();
        }
        super.draw();
    }
}