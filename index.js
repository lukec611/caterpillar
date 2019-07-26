
class EvilBox {
    constructor(x, y, width, height, gameDiv, screenSize) {
        this.p = new Point(x, y);
        this.width = width;
        this.height = height;
        this.screenSize = screenSize;
        this.gameDiv = gameDiv;
        this.init();
    } 

    init() {
        this._e = document.createElement('div');
        this._e.className = 'evil-box';
        this._e.style.width = `${this.width}px`;
        this._e.style.height = `${this.height}px`;
        this.gameDiv.appendChild(this._e);
        this.setPos(this.p);
        this.cs = new ChainSaw(0, 0, this.width, this.height);
        this._e.appendChild(this.cs._e);
        this.sqWave = 0;
    }

    setPos(p) {
        this.p.set(p.x, p.y);
        this._e.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }

    step(amount = 1) {
        this.setPos(this.p.sub(new Point(0, -amount)));
        this.cs.draw(this.sqWave < 5);
        this.sqWave = (this.sqWave + 1) % 10;
    }

    offScreen() {
        return this.p.y >= this.screenSize.y;
    }

    removeFromDom() {
        this._e.parentNode.removeChild(this._e);
    }
}

class Circle {

    constructor(x = 0, y = 0, r = 20, gameDiv) {
        this.p = new Point(x, y);
        this.r = r;
        this.gameDiv = gameDiv;
        this.init();
    }

    init() {
        this._element = document.createElement('div');
        this._element.style.width = `${this.r}px`;
        this._element.style.height = `${this.r}px`;
        this._element.className = 'caterpillar-body';
        this.gameDiv.appendChild(this._element);
    }

    getElement() {
        return this._element;
    }

    setPos(x, y) {
        this.p.set(x, y);
        this._element.style.transform = `translate(${x}px, ${y}px)`;
    }
    
}

class Caterpillar {
    constructor(elems = 7, gameDiv, screenSize) {
        this.gameDiv = gameDiv;
        this.screenSize = screenSize;
        this.elems = Array.from({ length: elems })
            .map(() => new Circle(undefined, undefined, undefined, this.gameDiv));
        this.init();
    }

    init() {
        const fixed_spacing = 20;
        const midPoint = this.screenSize.copy().scale(0.5);
        let spacing_amount = 0;
        for(let x of this.elems) {
            x.setPos(midPoint.x, spacing_amount + midPoint.y);
            spacing_amount += fixed_spacing;
        }
    }

    move(speed) {
        const e = this.elems[0];
        const np = new Point(e.p.x + speed, e.p.y);
        if (this.withinScreen(np)) {
            e.setPos(np.x, np.y);
        }
        for(let i = 1; i < this.elems.length; i++) {
            const ex = this.elems[i];
            const prev = this.elems[i-1];
            const xAxisIncrement = (prev.p.x - ex.p.x) * 0.3 + ex.p.x;
            ex.setPos(ex.p.x = xAxisIncrement, ex.p.y);
            
        }
    }

    withinScreen(p) {
        const box = this.gameDiv.getBoundingClientRect();
        return p.x >= 0 && p.x < box.width;
    }
}

function beginGame({
    screenSize,
    gameDiv,
}) {
    const screenSizePoint = new Point(screenSize.width, screenSize.height);
    const c = new Caterpillar(10, gameDiv, screenSizePoint);
    let boxes = [];
    boxes.push(randomBox());

    const keys = new Map();

    function randomBox() {
        // get box with lowest y pos, subtract a random amount from that
        // y pos, and put a block there, with a random height and width
        const width = Rand.rng(50, screenSize.width - 50);
        let xPos = Rand.rng(0, screenSize.width - width);
        if (Math.random() < 0.5) {
            xPos = screenSize.width - xPos - width;
        }
        const height = Rand.rng(10, 80);
        let yPos = Math.min(boxes.reduce((p, c) => Math.min(c.p.y, p), 0), 0) || 0; // the smallest current box y
        yPos -= height; // move up by height
        yPos -= Rand.rng(200, height + 240); // move up by an additional random amount
        return new EvilBox(xPos, yPos, width, height, gameDiv, screenSize);
    }
    
    function step() {
        let scalar = 0;
        if (keys.get('a')) {
            scalar = -1;
        } else if (keys.get('d')) {
            scalar = 1;
        }
        c.move(scalar * 6);
        boxes.forEach(b => b.step(4));
        boxes = boxes.filter(b => {
            if (b.offScreen()) {
                b.removeFromDom();
                return false;
            }
            return true;
        });
        while(boxes.length < 20) boxes.push(randomBox());
    }
    
    document.addEventListener('keydown', (e) => {
        if ('ad'.includes(e.key)) keys.set(e.key, true);
    });
    document.addEventListener('keyup', (e) => {
        if ('ad'.includes(e.key)) keys.set(e.key, false);
    });

    let prev = undefined;;

    document.addEventListener("pointermove", (e) => {
        const [x, y] = [e.clientX, e.clientY];
        console.log(x, y);

        if (prev) {
            const diff = x - prev.x;
            console.log(diff);
            if (diff < 0) {
                keys.set('a', true);
                keys.set('d', false);
            }
            if (diff > 0) {
                keys.set('d', true);
                keys.set('a', false);
            }
        }
        prev = { x, y };
    });



    setInterval(step, 20);
}


function onLoad() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    const screenSize = width < 400 ? {
        width,
        height,
    } : {
        width: 400,
        height,
    };
    const padding = 10;
    screenSize.width -= padding;
    screenSize.height -= padding;
    console.log('screen loaded', width, height);
    const gameDiv = document.getElementById('game-screen');
    gameDiv.style.width = `${screenSize.width}px`;
    gameDiv.style.height = `${screenSize.height}px`;

    beginGame({
        screenSize,
        gameDiv,
    });
}

document.body.onload = onLoad;