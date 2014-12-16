function PRNG(){}
PRNG.initialize_generator = function( seed )
{
    // Create a length 624 array to store the state of the generator
    this.MT = new Uint32Array( 624 );
    this.index = 0;
    this.MT[ 0 ] = seed;
    for( i = 1 ; i < 624; i++ )
    {
        this.MT[ i ] = ( 1812433253 * ( this.MT[i-1] ^ ( this.MT[ i-1 ] >> 30  ) + i ) );
    }
};

PRNG.extract_number = function()
{
    if( this.index == 0 )
    {
        this.generate_numbers()
    }

    var y = this.MT[ this.index ];
    y = y ^ ( y >> 11 );
    y = y ^ ( ( y << 7 ) & 2636928640 );
    y = y ^ ( ( y << 15 ) & 4022730752 );
    y = y ^ ( y >> 18 );

    this.index = ( this.index + 1 ) % 624;
    return y;
};

PRNG.generate_numbers = function()
{
    for( var i = 0; i < 624; i++ )
    {
        var y = ( this.MT[ i ] & 0x80000000 ) + ( this.MT[( i + 1 ) % 624 ] & 0x7fffffff );
        this.MT[ i ] = this.MT[ ( i + 397 ) % 624] ^ ( y >> 1 );
        if ( y % 2 != 0 )
        {
            this.MT[ i ] = this.MT[ i ] ^ 2567483615;
        }
    }
};

PRNG.random = function()
{
    return ( this.extract_number() / 0x7FFFFFFF );
};

PRNG.initialize_generator(0);

function random( min, max )
{
    return min + parseInt( PRNG.random() * max +.5 );
}

//math utils
function lerp( t, a, b )
{
    return a + t * ( b - a );
}

function norm( t, a, b )
{
    return ( t - a ) / ( b - a );
}

function map( t, a0, b0, a1, b1 )
{
    return lerp( norm( t, a0, b0 ), a1, b1 );
}


//utils 2d

function angle(a,b)
{
    return Math.atan2( b.y- a.y, a.x- a.y );
}

function distance(p0,p1)
{

    var dx = p0.x - p1.x;
    var dy = p0.y - p1.y;
    var dz = p0.z - p1.z;
    return Math.sqrt( dx*dx+dy*dy+dz*dz );
}
var Point = function( x,y,z )
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

Point.prototype =
{
    clone : function(){ return new Point( this.x, this.y, this.z ); },
    multiplyScalar: function( s ){ this.x *= s;  this.y *= s; this.z *= s; return this; }
};

//array utils

Array.expand = function( values, length )
{
    var tmp = [];
    var i;
    if ( values.length == 1 )
    {
        i = length;
        while ( i-- ) tmp.push( values[0] );
        return tmp;
    }
    var step = 1 / ( ( values.length-1 ) / (length-1) );
    for ( i = 0; i < length; i+= step )
    {
        var val0 = values[ parseInt( i / step ) ];

        var max = ( parseInt( i / step ) + 1 );
        if ( max > values.length - 1 ) max = values.length - 1;
        var val1 = values[ max ];

        var delta = ( i + step > length ) ? ( length - i ) : step;
        for (var j = 0; j < delta; j++)
        {
            tmp.push( val0 + ( val1 - val0 ) * ( j / delta ) );
        }
    }
    while ( tmp.length < length ) tmp.push( values[ values.length - 1 ] );
    return tmp;
};
Array.expand2D = function( u, v, length0, length1 )
{
    var _u = Array.expand( u, length0 );
    var _v = Array.expand( v, length1 );
    var tmp = [];
    for (var i = 0; i < length0; i++)
    {
        for (var j = 0; j < length1; j++)
        {
            tmp.push( new THREE.Vector2( _u[ i ], _v[ j ] ) );
        }
    }
    return tmp;
};
Array.expand3D = function( u, v, w, length0, length1, length2 )
{
    var _u = Array.expand( u, length0 );
    var _v = Array.expand( v, length1 );
    var _w = Array.expand( w, length2 );
    var tmp = [];
    for (var i = 0; i < length0; i++)
    {
        for (var j = 0; j < length1; j++)
        {
            for (var k = 0; k < length2; k++)
            {
                tmp.push(new THREE.Vector3(_u[i], _v[j], _w[k]));
            }
        }
    }
    return tmp;
};


//Canvas Utils
//background noise
var CanvasNoise = function( width, height, min, max, color, alpha )
{

    min = min || 0;
    max = max || 0xFF;
    var delta = ( max - min );

    color = ( color != null && color == true );
    alpha = ( alpha != null && alpha == true );

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext( "2d" );
    var img = ctx.getImageData(0,0,width,height);
    var data = img.data;

    for( var i = 0; i < data.length; i += 4 )
    {

        if( !color )
        {
            var val = min + ( parseInt( Math.random() * delta ) );
            data[ i ] = data[ i + 1 ] = data[ i + 2 ] = val;
        }
        else
        {
            data[ i ] = min + ( parseInt( Math.random() * delta ) );
            data[ i + 1 ] = min + ( parseInt( Math.random() * delta ) );
            data[ i + 2 ] = min + ( parseInt( Math.random() * delta ) );
        }

        if( alpha )
        {
            data[ i + 3 ] = parseInt( Math.random() * 0xFF );
        }
        else
        {
            data[ i + 3 ] = 255;
        }
    }

    ctx.putImageData( img,0,0 );
    //document.body.style.backgroundImage = "url(" + canvas.toDataURL("image/png")+ ")";
    //document.body.appendChild( canvas );

    return canvas;
};
var PI2 = Math.PI * 2;
var RAD = Math.PI / 180;
var DEG = 180 / Math.PI;
var ZERO = new THREE.Vector3();

function rotate( p, lattice, angle ){var a = Point.angle( lattice, p ) + angle;var d = Point.distance( lattice, p );var pp = new Point();pp.x = lattice.x + Math.cos( a ) * d;pp.y = lattice.y + Math.sin( a ) * d;return pp;}
function reflect(p,a,b){var pp = Utils.project( p, a, b, false );return new Point( p.x + ( pp.x - p.x ) * 2,p.y + ( pp.y - p.y ) * 2  );}
function glide(p,a,b,distance){var t = Utils.reflect( p, a, b );var angle = Point.angle( a, b );return Point.translate( t, cos( angle ) * Point.distance, sin( angle ) * distance );}
function project( p, a, b, asSegment ){var dx = b.x - a.x;var dy = b.y - a.y;if ( asSegment && dx == 0 && dy == 0 ){return a;}var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );if ( asSegment && t < 0) return a;if ( asSegment && t > 1) return b;return new Point( a.x + t * dx, a.y + t * dy );}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
function getHashVariable(variable)
{
    var query = window.location.hash.substring(1);
    //console.log( "hash", query )
    var vars = query.split("&");
    //console.log( "hash vars", query )
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        //console.log( "hash pair", pair)
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
