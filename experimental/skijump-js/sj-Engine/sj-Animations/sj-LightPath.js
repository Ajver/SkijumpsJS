
class Light {
    constructor(x, y, light) {
        this.x = x;
        this.y = y;
        this.light = light;
    }

    draw() {
        image(this.light, this.x, this.y);
    }
}

SJ.LightPath =
class {
    constructor(lightTexturePath, path, duration) {
        const lightTexture = SJ.ImageLoader.load(lightTexturePath);

        this.lights = Array(path.length);

        for(let i=0; i<path.length; i++) {
            const pos = path[i];
            this.lights[i] = new Light(pos.x, pos.y, lightTexture)
        }

        this.timer = new SJ.Timer(duration, true, true, true)
    }

    draw() {
        this.timer.tick();

        const { length } = this.lights;
        
        if(!length) {
            return;
        }

        let index = floor(length * this.timer.getProgress());
        index = min(index, length-1);
        this.lights[index].draw();
    }
}