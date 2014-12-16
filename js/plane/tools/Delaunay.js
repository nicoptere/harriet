

var Delaunay = function()
{
    this.EPSILON = 0.00001;
    this.SUPER_TRIANGLE_RADIUS = 1000000;

    this.compute = function( points )
    {
        points.sort( function( a, b ){ return a.x < b.x ? -1 : 1;} );

        this.indices = [];
        this.circles = [];

        var nv = points.length;
        if (nv < 3) return null;

        var d = this.SUPER_TRIANGLE_RADIUS;
        points.push( 	new Point( 0, -d ) 	);
        points.push( 	new Point( d, d ) 	);
        points.push( 	new Point( -d, d )	);

        this.indices = [];
        this.indices.push( points.length - 3 );
        this.indices.push( points.length - 2 );
        this.indices.push( points.length - 1 );

        this.circles = [];
        this.circles.push( 0 );
        this.circles.push( 0 );
        this.circles.push( d );

        var edgeIds = [];
        var i, j, k, id0, id1, id2;
        for ( i = 0; i < nv; i++ )
        {

            j = 0;
            while( j < this.indices.length )
            {
                if ( 	this.circles[ j + 2 ] > this.EPSILON &&  this.circleContains( j, points[ i ] )	)
                {
                    id0 = this.indices[ j ];
                    id1 = this.indices[ j + 1 ];
                    id2 = this.indices[ j + 2 ];

                    edgeIds.push( id0 );
                    edgeIds.push( id1 );
                    edgeIds.push( id1 );
                    edgeIds.push( id2 );
                    edgeIds.push( id2 );
                    edgeIds.push( id0 );

                    this.indices.splice( j, 3 );
                    this.circles.splice( j, 3 );
                    j -= 3;
                }
                j += 3;
            }

            j = 0;
            while ( j < edgeIds.length )
            {
                k = ( j + 2 );
                while ( k < edgeIds.length )
                {
                    if(	(	edgeIds[ j ] == edgeIds[ k ] && edgeIds[ j + 1 ] == edgeIds[ k + 1 ]	)
                        ||	(	edgeIds[ j + 1 ] == edgeIds[ k ] && edgeIds[ j ] == edgeIds[ k + 1 ]	)	)
                    {
                        edgeIds.splice( k, 2 );
                        edgeIds.splice( j, 2 );
                        j -= 2;
                        k -= 2;
                        if ( j < 0 || j > edgeIds.length - 1 ) break;
                        if ( k < 0 || k > edgeIds.length - 1 ) break;
                    }
                    k += 2;
                }
                j += 2;
            }
            j = 0;
            while( j < edgeIds.length )
            {
                this.indices.push( edgeIds[ j ] );
                this.indices.push( edgeIds[ j + 1 ] );
                this.indices.push( i );
                this.computeCircle( points, edgeIds[ j ], edgeIds[ j + 1 ], i );
                j += 2;
            }
            edgeIds = [];

        }

        id0 = points.length - 3;
        id1 = points.length - 2;
        id2 = points.length - 1;

        i = 0;
        while( i < this.indices.length )
        {
            if (    this.indices[ i ] == id0     || this.indices[ i ] == id1     || this.indices[ i ] == id2
                ||	this.indices[ i + 1 ] == id0 || this.indices[ i + 1 ] == id1 || this.indices[ i + 1 ] == id2
                ||	this.indices[ i + 2 ] == id0 || this.indices[ i + 2 ] == id1 || this.indices[ i + 2 ] == id2 )
            {
                this.indices.splice( i, 3 );
                this.circles.splice( i, 3 );
                if( i > 0 ) i-=3;
                continue;
            }
            i += 3;
        }
        points.pop();
        points.pop();
        points.pop();

        return this.indices;

    };

    this.circleContains = function( circleId, p )
    {
        var dx = this.circles[ circleId ] - p.x;
        var dy = this.circles[ circleId + 1 ] - p.y;
        return this.circles[ circleId + 2 ] > dx * dx + dy * dy;
    };

    this.computeCircle = function( Points, id0, id1, id2 )
    {
        var p0 = Points[ id0 ];
        var p1 = Points[ id1 ];
        var p2 = Points[ id2 ];
        var A = p1.x - p0.x;
        var B = p1.y - p0.y;
        var C = p2.x - p0.x;
        var D = p2.y - p0.y;
        var E = A * (p0.x + p1.x) + B * (p0.y + p1.y);
        var F = C * (p0.x + p2.x) + D * (p0.y + p2.y);
        var G = 2.0 * (A * (p2.y - p1.y) - B * (p2.x - p1.x));

        var x = (D * E - B * F) / G;
        this.circles.push( x );

        var y = (A * F - C * E) / G;
        this.circles.push( y );

        x -= p0.x;
        y -= p0.y;
        this.circles.push( x * x + y * y );
    };
};