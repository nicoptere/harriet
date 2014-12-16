

/***************************************************************************************


 DOUGLAS PEUCKER SIMPLIFICATION


 ***************************************************************************************/
var Simplify = {};

Simplify.compute = function( points, tolerance )
{
    var t = Date.now();

    if ( points == null || points.length < 3)
    {
        return points;
    }

    var firstPoint = 0;
    var lastPoint = points.length - 1;
    var pointIndicesToKeep = [ firstPoint, lastPoint ];

    //The first and the last point cannot be the same
    while ( points[ firstPoint ].x == points[ lastPoint].x
    &&      points[ firstPoint ].y == points[ lastPoint].y  )
    {
        lastPoint--;
    }


    Simplify.reduce( points, firstPoint, lastPoint, tolerance, pointIndicesToKeep );

    var returnPoints = [];
    pointIndicesToKeep.sort( function( a, b ){return a < b ? -1 : 1;} );

    pointIndicesToKeep.forEach( function( index )
    {
        returnPoints.push( points[ index ] );
    });

    console.log( "simplify", Date.now()-t, "ms");
    return returnPoints;

};


/// Douglases the peucker reduction.

Simplify.reduce = function( points, firstPoint, lastPoint, tolerance, pointIndicesToKeep )
{
    var maxDistance = 0;
    var indexFarthest= 0;

    for ( var index = firstPoint; index < lastPoint; index++ )
    {
        var distance = Simplify.perpendicularDistance( points[firstPoint], points[lastPoint], points[index] );
        if ( distance > maxDistance )
        {
            maxDistance = distance;
            indexFarthest = index;
        }
    }

    if ( maxDistance > tolerance && indexFarthest != 0 )
    {
        //Add the largest point that exceeds the tolerance
        pointIndicesToKeep.push( indexFarthest );

        Simplify.reduce( points, firstPoint, indexFarthest, tolerance, pointIndicesToKeep );
        Simplify.reduce( points, indexFarthest, lastPoint, tolerance, pointIndicesToKeep );

    }
};

/// The distance of a point from a line made from point1 and point2.

Simplify.perpendicularDistance = function( point1, point2, point )
{
    //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
    //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
    //Area = .5*Base*H                                          *Solve for height
    //Height = Area/.5/Base

    var area = Math.abs( .5 * ( point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y ) );
    var bottom = Math.sqrt( Math.pow( point1.x - point2.x, 2) + Math.pow( point1.y - point2.y, 2 ) );
    return area / bottom * 2;

};
