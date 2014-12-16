// Generated by CoffeeScript 1.4.0
//https://github.com/prideout/polygon.js

var POLYGON,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

POLYGON = {};

POLYGON.tessellate = function(coords, holes) {

    var ab, ac, ap, bc, bp, ca, checkEar, convex, cp, earIndex, ears, getNeighbors, getSlice, h, hole, holeStart, i, intersectSegmentX, isEar, isReflexAngle, isReflexIndex, n, neighbor, newPolygon, ntriangle, p, pcurr, pnext, pointInTri, polygon, pprev, ptriangle, reflex, reflexCount, slice, triangles, vec2, verbose, wasEar, watchdog, _, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _results;
    vec2 = POLYGON.vec2;
    ab = new vec2();
    bc = new vec2();
    ca = new vec2();
    ap = new vec2();
    bp = new vec2();
    cp = new vec2();
    ac = new vec2();
    pointInTri = function(p, tri) {
        var a, b, c;
        ab.sub(tri[1], tri[0]);
        bc.sub(tri[2], tri[1]);
        ca.sub(tri[0], tri[2]);
        ap.sub(p, tri[0]);
        bp.sub(p, tri[1]);
        cp.sub(p, tri[2]);
        a = ab.cross(ap);
        b = bc.cross(bp);
        c = ca.cross(cp);
        if (a < 0 && b < 0 && c < 0) {
            return true;
        }
        if (a > 0 && b > 0 && c > 0) {
            return true;
        }
        return false;
    };
    isReflexAngle = function(a, b, c) {
        ac.sub(c, a);
        ab.sub(b, a);
        return 0 > ac.cross(ab);
    };
    intersectSegmentX = function(p0, p1, y) {
        var t;
        if (p0.y === p1.y) {
            return p0.x;
        }
        if (p0.y < p1.y) {
            t = (y - p0.y) / (p1.y - p0.y);
            return p0.x + t * (p1.x - p0.x);
        } else {
            t = (y - p1.y) / (p0.y - p1.y);
            return p1.x + t * (p0.x - p1.x);
        }
    };
    if (coords.length < 3) {
        return [];
    }
    if (coords.length === 3 && holes.length === 0) {
        return [0, 1, 2];
    }
    reflex = [];
    polygon = (function() {
        _results = [];
        for (var _i = 0, _ref = coords.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
    }).apply(this);
    reflexCount = 0;
    getSlice = function(hole) {
        var E, I, M, Mn, P, Pn, R, Rn, Rslope, c0, c1, coord, dx, dy, n, ncurr, nnext, p, slice, slope, tricoords, x, xrightmost, _j, _k, _l, _len, _len1, _len2, _ref1, _ref2;
        Mn = 0;
        xrightmost = -10000;
        for (n = _j = 0, _len = hole.length; _j < _len; n = ++_j) {
            coord = hole[n];
            if (coord.x > xrightmost) {
                xrightmost = coord.x;
                Mn = n;
            }
        }
        M = hole[Mn];
        E = 0.0001;
        I = new vec2(10000, M.y);
        P = new vec2();
        Pn = -1;
        for (ncurr = _k = 0, _len1 = coords.length; _k < _len1; ncurr = ++_k) {
            c0 = coords[ncurr];
            nnext = (ncurr + 1) % coords.length;
            c1 = coords[nnext];
            if (c0.x < M.x && c1.x < M.x) {
                continue;
            }
            if (c0.x > I.x && c1.x > I.x) {
                continue;
            }
            if (((c0.y <= (_ref1 = M.y) && _ref1 <= c1.y)) || ((c1.y <= (_ref2 = M.y) && _ref2 <= c0.y))) {
                x = intersectSegmentX(c0, c1, M.y);
                if (x < I.x) {
                    I.x = x;
                    if (c0.x > c1.x) {
                        P = c0;
                        Pn = ncurr;
                    } else {
                        P = c1;
                        Pn = nnext;
                    }
                }
            }
        }
        tricoords = [M, I, P];
        Rslope = 1000;
        Rn = -1;
        for (p = _l = 0, _len2 = polygon.length; _l < _len2; p = ++_l) {
            n = polygon[p];
            if (!reflex[p]) {
                continue;
            }
            R = coords[n];
            if (pointInTri(R, tricoords)) {
                dy = Math.abs(R.y - P.y);
                dx = Math.abs(R.x - P.x);
                if (dx === 0) {
                    continue;
                }
                slope = dy / dx;
                if (slope < Rslope) {
                    Rslope = slope;
                    Rn = n;
                }
            }
        }
        if (Rn !== -1) {
            Pn = Rn;
        }
        return slice = [Pn, Mn];
    };
    getNeighbors = function(pcurr) {
        var pnext, pprev;
        pprev = (pcurr + polygon.length - 1) % polygon.length;
        pnext = (pcurr + 1) % polygon.length;
        return [pprev, pnext];
    };
    checkEar = function(pcurr) {
        var i, isEar, n, ntriangle, p, pnext, pprev, ptriangle, tricoords, _j, _len, _ref1;
        if (reflexCount === 0) {
            return true;
        }
        _ref1 = getNeighbors(pcurr), pprev = _ref1[0], pnext = _ref1[1];
        ptriangle = [pprev, pcurr, pnext];
        ntriangle = (function() {
            var _j, _len, _results1;
            _results1 = [];
            for (_j = 0, _len = ptriangle.length; _j < _len; _j++) {
                p = ptriangle[_j];
                _results1.push(polygon[p]);
            }
            return _results1;
        })();
        tricoords = (function() {
            var _j, _len, _results1;
            _results1 = [];
            for (_j = 0, _len = ntriangle.length; _j < _len; _j++) {
                i = ntriangle[_j];
                _results1.push(coords[i]);
            }
            return _results1;
        })();
        isEar = true;
        for (p = _j = 0, _len = polygon.length; _j < _len; p = ++_j) {
            n = polygon[p];
            if (__indexOf.call(ntriangle, n) >= 0) {
                continue;
            }
            if (!reflex[p]) {
                continue;
            }
            if (pointInTri(coords[n], tricoords)) {
                isEar = false;
                break;
            }
        }
        return isEar;
    };
    isReflexIndex = function(pcurr) {
        var a, b, c, pnext, pprev, _ref1;
        _ref1 = getNeighbors(pcurr), pprev = _ref1[0], pnext = _ref1[1];
        a = coords[polygon[pprev]];
        b = coords[polygon[pcurr]];
        c = coords[polygon[pnext]];
        return isReflexAngle(a, b, c);
    };
    slice = [];
    if (holes != null && holes[0].length >= 3) {
        for (p = _j = 0, _len = polygon.length; _j < _len; p = ++_j) {
            n = polygon[p];
            reflex.push(isReflexIndex(p));
        }
        hole = holes[0];
        slice = getSlice(hole);
        coords = coords.slice(0);
        holeStart = coords.length;
        for (_k = 0, _len1 = hole.length; _k < _len1; _k++) {
            h = hole[_k];
            coords.push(h);
        }
        newPolygon = [];
        i = (slice[0] + 1) % polygon.length;
        for (_ = _l = 0, _ref1 = polygon.length; 0 <= _ref1 ? _l < _ref1 : _l > _ref1; _ = 0 <= _ref1 ? ++_l : --_l) {
            newPolygon.push(polygon[i]);
            i = (i + 1) % polygon.length;
        }
        i = slice[1];
        for (_ = _m = 0, _ref2 = hole.length; 0 <= _ref2 ? _m < _ref2 : _m > _ref2; _ = 0 <= _ref2 ? ++_m : --_m) {
            newPolygon.push(holeStart + i);
            i = (i + 1) % hole.length;
        }
        newPolygon.push(newPolygon[polygon.length]);
        newPolygon.push(newPolygon[polygon.length - 1]);
        polygon = newPolygon;
    }
    convex = [];
    reflex = [];
    reflexCount = 0;
    for (p = _n = 0, _len2 = polygon.length; _n < _len2; p = ++_n) {
        n = polygon[p];
        if (isReflexIndex(p)) {
            reflex.push(true);
            reflexCount = reflexCount + 1;
        } else {
            reflex.push(false);
            convex.push(p);
        }
    }
    ears = [];
    for (_o = 0, _len3 = convex.length; _o < _len3; _o++) {
        p = convex[_o];
        if (checkEar(p)) {
            ears.push(p);
        }
    }
    verbose = false;
    if (verbose) {
        console.info("");
        console.info("ears    " + ears);
        console.info("reflex  " + reflex);
        console.info("convex  " + convex);
    }
    triangles = [];
    while (polygon.length > 0) {
        pcurr = ears.pop();
        watchdog = watchdog - 1;
        _ref3 = getNeighbors(pcurr), pprev = _ref3[0], pnext = _ref3[1];
        ptriangle = [pprev, pcurr, pnext];
        ntriangle = (function() {
            var _len4, _p, _results1;
            _results1 = [];
            for (_p = 0, _len4 = ptriangle.length; _p < _len4; _p++) {
                p = ptriangle[_p];
                _results1.push(polygon[p]);
            }
            return _results1;
        })();
        triangles.push(ntriangle);
        polygon.splice(pcurr, 1);
        reflex.splice(pcurr, 1);
        for (i = _p = 0, _len4 = ears.length; _p < _len4; i = ++_p) {
            p = ears[i];
            if (p > pcurr) {
                ears[i] = ears[i] - 1;
            }
        }
        if (pnext > pcurr) {
            pnext = pnext - 1;
        }
        if (pprev > pcurr) {
            pprev = pprev - 1;
        }
        _ref4 = [pprev, pnext];
        for (_q = 0, _len5 = _ref4.length; _q < _len5; _q++) {
            neighbor = _ref4[_q];
            if (reflex[neighbor] && (!isReflexIndex(neighbor))) {
                reflex[neighbor] = false;
                reflexCount = reflexCount - 1;
            }
            if (!reflex[neighbor]) {
                isEar = checkEar(neighbor);
                earIndex = ears.indexOf(neighbor);
                wasEar = earIndex !== -1;
                if (isEar && !wasEar) {
                    ears.push(neighbor);
                } else if (!isEar && wasEar) {
                    ears.splice(earIndex, 1);
                }
            }
        }
    }
    return triangles;
};


POLYGON.vec2 = function ( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
};
POLYGON.vec2.prototype = {
    constructor: POLYGON.vec2,
    set: function ( x, y ) {
        this.x = x;
        this.y = y;
        return this;
    },
    copy: function ( v ) {
        this.x = v.x;
        this.y = v.y;
        return this;
    },
    add: function ( a, b ) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    },
    sub: function ( a, b ) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    },
    multiplyScalar: function ( s ) {
        this.x *= s;
        this.y *= s;
        return this;
    },
    divideScalar: function ( s ) {
        if ( s ) {
            this.x /= s;
            this.y /= s;
        } else {
            this.set( 0, 0 );
        }
        return this;
    },
    negate: function() {
        return this.multiplyScalar( - 1 );
    },
    dot: function ( v ) {
        return this.x * v.x + this.y * v.y;
    },
    cross: function ( v ) {
        return this.x * v.y - this.y * v.x;
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y;
    },
    length: function () {
        return Math.sqrt( this.lengthSq() );
    },
    normalize: function () {
        return this.divideScalar( this.length() );
    },
    distanceTo: function ( v ) {
        return Math.sqrt( this.distanceToSquared( v ) );
    },
    distanceToSquared: function ( v ) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    },
    setLength: function ( l ) {
        return this.normalize().multiplyScalar( l );
    },
    lerpSelf: function ( v, alpha ) {
        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        return this;
    },
    equals: function( v ) {
        return ( ( v.x === this.x ) && ( v.y === this.y ) );
    },
    isZero: function ( v ) {
        return this.lengthSq() < ( v !== undefined ? v : 0.0001 );
    },
    clone: function () {
        return new POLYGON.vec2( this.x, this.y );
    }
};
;
