
class ChainSaw {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.spikeWidth = 10;
        this.spikeHeight = 3;
        this.init();
    }

    init() {
        const { w, h } = this;
        this._e = document.createElement('canvas');
        this._e.width = w;
        this._e.height = h;
        this._e.style.width = `${w}px`;
        this._e.style.height = `${h}px`;
        this.ctx = this._e.getContext('2d');
        const area = w * 2 + h * 2;
        this.area = area;
        this.phases = [
            w / area,
            (w + h) / area,
            (w*2 + h) / area,
            1,
        ];
        this.draw();
    }

    clearScreen() {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.w, this.h)
        this.ctx.fillStyle = "rgba(0,0,0,0)";
        this.ctx.fill();
    }

    getShapePoint(percentage) {
        let pfrom, pto, subPercentage;
        const { phases, area, w, h, spikeWidth } = this;
        if (percentage < phases[0]) {
            if (percentage < 0) return;
            pfrom = new Point(0, 0);
            pto = new Point(w, 0);
            subPercentage = percentage / phases[0];
        } else if (percentage < phases[1]) {
            pfrom = new Point(w, 0);
            pto = new Point(w, h);
            subPercentage = (percentage - phases[0]) / (phases[1] - phases[0]);
        } else if (percentage < phases[2]) {
            pfrom = new Point(w, h);
            pto = new Point(0, h);
            subPercentage = (percentage - phases[1]) / (phases[2] - phases[1]);
        } else {
            pfrom = new Point(0, h);
            pto = new Point(0, 0);
            subPercentage = (percentage - phases[2]) / (phases[3] - phases[2]);
        }
        if (subPercentage < 0 || subPercentage > 1) return;
        return Point.interpolate(pfrom, pto, ChainSaw.fixPercentage(subPercentage));
    }

    drawSpike(p1, p2) {
        const vec = p2.copy().sub(p1);
        let spikeBase = p1;
        vec.toUnit().toNormal().scale(this.spikeHeight).add(spikeBase);
        this.drawLine(p1, vec);
        this.drawLine(vec, p2);
    }

    drawLine(p1, p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    draw(shift) {
        this.clearScreen();
        let inc = this.spikeWidth / this.area * 100;
        let p1 = this.getShapePoint(inc);
        let iStart = this.spikeWidth * (shift ? 0 : 0.1);
        for(let i = iStart; i <= 100+inc; i += inc) {
            const p2 = this.getShapePoint(ChainSaw.fixPercentage(i / 100));
            if (p1 && p2) {
                this.drawSpike(p1, p2);
            }
            p1 = p2;
        }
    }

    static fixPercentage(p) {
        // return p;
        return p > 1 ? p - 1 : p;
        if (p > 1) return p - 1;
        if (p < 0) return p + 1;
        return p;
    }
    
}








