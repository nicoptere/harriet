
function clamp(val, min, max){
    return val < min? min : (val > max? max : val);
}

function m_lerp( t, a, b ){
    return a + t * ( b - a );
}

function m_norm( t, a, b ){
    return ( t - a ) / ( b - a );
}

function m_map( t, a0, b0, a1, b1 ){
    return m_lerp( m_norm( t, a0, b0 ), a1, b1 );
}
var MathUtils = function(){};

/**
 * converts a XYZ vector3 to longitude latitude (Direct Polar)
 * @param lng longitude
 * @param lat latitude
 * @param out optional output vector3
 * @returns a unit vector of the 3d position
 */
MathUtils.lonLatToVector3 = function( lng, lat, out )
{
    out = out || new THREE.Vector3();

    //flips the Y axis
    lat = Math.PI / 2 - lat;

    //distribute to sphere
    out.set(
        Math.sin( lat ) * Math.sin( lng ),
        Math.cos( lat ),
        Math.sin( lat ) * Math.cos( lng )
    );

    return out;

};

/**
 * converts a XYZ THREE.Vector3 to longitude latitude
 * @param vector3
 * @returns an array containing the longitude [0] & the lattitude [1] of the Vector3
 */
MathUtils.vector3toLonLat = function( vector3 )
{

    vector3.normalize();

    //longitude = angle of the vector around the Y axis
    //-( ) : negate to flip the longitude (3d space specific )
    //- PI / 2 to face the Z axis
    var lng = -( Math.atan2( -vector3.z, -vector3.x ) ) - Math.PI / 2;

    //to bind between -PI / PI
    if( lng < - Math.PI )lng += Math.PI * 2;

    //latitude : angle between the vector & the vector projected on the XZ plane on a unit sphere

    //project on the XZ plane
    var p = new THREE.Vector3( vector3.x, 0, vector3.z );
    //project on the unit sphere
    p.normalize();

    //commpute the angle ( both vectors are normalized, no division by the sum of lengths )
    var lat = Math.acos( p.dot( vector3 ) );

    //invert if Y is negative to ensure teh latitude is comprised between -PI/2 & PI / 2
    if( vector3.y < 0 ) lat *= -1;

    return [ lng,lat ];

};

/**
 * determines if a polyline contains a point
 * @param polygon a series of X,Y coordinates pairs
 * @param x point.x
 * @param y point.y
 * @returns true if the path contains the point, false otherwise
 */
MathUtils.polygonContains = function( polygon, x, y )
{
    var j = 0;
    var oddNodes = false;
    for( var i = 0; i < polygon.length; i++ )
    {

        j = ( i + 1 ) % polygon.length;

        var ix = polygon[ i ].x;
        var iy = polygon[ i ].y;
        var jx = polygon[ j ].x;
        var jy = polygon[ j ].y;

        if ( ( iy < y && jy >= y ) || ( jy < y && iy >= y )    )
        {
            if ( ix + ( y - iy ) / ( jx - ix ) * ( jx - ix ) < x )
            {
                oddNodes = !oddNodes
            }
        }
    }
    return oddNodes;

};
/**
 *
 * @param px start point
 * @param py
 * @param pz
 * @param x2 end point
 * @param y2
 * @param z2
 * @param cx sphere position
 * @param cy
 * @param cz
 * @param radius sphere radius
 * @returns {*}
 */
MathUtils.intersectSphere = function( px, py, pz, x2, y2, z2, cx, cy, cz, radius )
{

    var vx = x2 - px;
    var vy = y2 - py;
    var vz = z2 - pz;

    var A = (vx * vx + vy * vy + vz * vz);
    var B = 2.0 * (px * vx + py * vy + pz * vz - vx * cx - vy * cy - vz * cz);
    var C = px * px - 2 * px * cx + cx * cx + py * py - 2 * py * cy + cy * cy + pz * pz - 2 * pz * cz + cz * cz - radius * radius;

    var D = B * B - 4 * A * C;
    if (D >= 0)
    {
        var t1 = (-B - Math.sqrt(D)) / (2.0 * A);
        var t2 = (-B + Math.sqrt(D)) / (2.0 * A);

        // we choose the nearest t from the first point
        var t = ( t1 < t2 ) ? t1 : t2;

        return new THREE.Vector3(
            px + t * ( x2 -  px ),
            py + t * ( y2 -  py ),
            pz + t * ( z2 -  pz )
        );
    }
    return null;
};