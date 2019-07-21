
class Rand {
    static rng(from, to) {
        return Math.floor(Math.random() * (to - from)) + from;
    }
}

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }

    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    toUnit() {
        const d = this.mag();
        return this.scale(1 / d);
    }

    toNormal() {
        const x = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    }

    static interpolate(a, b, percentage) {
        const vector = b.copy().sub(a);
        vector.scale(percentage);
        vector.add(a);
        return vector;
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}