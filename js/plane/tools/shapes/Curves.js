function Cardinal(){}
/**
 *
 * @param vertices
 * @param precision
 * @param tension
 * @param loop
 * @param target
 * @returns {*|Array}
 */
Cardinal.compute = function( vertices, precision, tension, loop, target )
{

    precision =  Math.max( .01, Math.min( 1, precision ||.1 ) );
    tension = Math.max( -5, Math.min( 5, tension || 0 ) );

    loop = loop || false;
    target = target || [];

    var p03D, p13D, p23D, p33D;
    var i, t;
    for (i = 0; i < vertices.length - ( loop ? 0 : 1 ); i++)
    {

        p0 = (i < 1) ? vertices [vertices.length - 1] : vertices [i - 1];
        p1 = vertices [i];
        p2 = vertices [(i +1 + vertices.length) % vertices.length];
        p3 = vertices [(i +2 + vertices.length) % vertices.length];

        for ( t= 0; t < 1; t += precision )
        {
            target.push(  new THREE.Vector3 	(
                // x
                tension * ( -t * t * t + 2 * t * t - t) * p0.x +
                tension * ( -t * t * t + t * t) * p1.x +
                (2 * t * t * t - 3 * t * t + 1) * p1.x +
                tension * (t * t * t - 2 * t * t + t) * p2.x +
                ( -2 * t * t * t + 3 * t * t) * p2.x +
                tension * (t * t * t - t * t) * p3.x,

                // y
                tension * ( -t * t * t + 2 * t * t - t) * p0.y +
                tension * ( -t * t * t + t * t) * p1.y +
                (2 * t * t * t - 3 * t * t + 1) * p1.y +
                tension * (t * t * t - 2 * t * t + t) * p2.y +
                ( -2 * t * t * t + 3 * t * t) * p2.y +
                tension * (t * t * t - t * t) * p3.y,

                // z
                tension * ( -t * t * t + 2 * t * t - t) * p0.z +
                tension * ( -t * t * t + t * t) * p1.z +
                (2 * t * t * t - 3 * t * t + 1) * p1.z +
                tension * (t * t * t - 2 * t * t + t) * p2.z +
                ( -2 * t * t * t + 3 * t * t) * p2.z +
                tension * (t * t * t - t * t) * p3.z

            ) );
        }
    }
    if ( loop )
    {
        target.push( target[0] );
    }
    else {
        target.push( vertices[vertices.length -1 ] );
    }
    return target;
};


function CatmullRom(){}
/**
 *
 * @param vertices
 * @param precision
 * @param loop
 * @param target
 * @returns {*|Array}
 */
CatmullRom.compute = function( vertices, precision, loop, target )
{

    precision =  Math.max( .001, Math.min( .999, precision ||.1 ) );

    loop = loop || false;

    target = target || [];
    target.push( new THREE.Vector3 ( vertices[0].x, vertices[0].y, vertices[0].z ) );

    var i, t;
    var p03D, p13D, p23D, p33D;
    for (i = 0; i < vertices.length - ( loop ? 0 : 1 ); i++)
    {
        p0 = vertices [(i -1 + vertices.length) % vertices.length];
        p1 = vertices [i];
        p2 = vertices [(i +1 + vertices.length) % vertices.length];
        p3 = vertices [(i +2 + vertices.length) % vertices.length];

        for ( t = precision; t < 1; t+= precision )
        {
            target.push( new THREE.Vector3 (	0.5 * ((          2*p1.x) +
                                        t * (( -p0.x           +p2.x) +
                                        t * ((2*p0.x -5*p1.x +4*p2.x -p3.x) +
                                        t * (  -p0.x +3 * p1.x -3 * p2.x +p3.x)))),

                                        0.5 * ((          2*p1.y) +
                                        t * (( -p0.y           +p2.y) +
                                        t * ((2*p0.y -5*p1.y +4*p2.y -p3.y) +
                                        t * (  -p0.y +3 * p1.y -3 * p2.y +p3.y)))),

                                        0.5 * ((          2*p1.z) +
                                        t * (( -p0.z           +p2.z) +
                                        t * ((2*p0.z -5*p1.z +4*p2.z -p3.z) +
                                        t * (  -p0.z +3 * p1.z -3 * p2.z +p3.z))))		) );
        }
    }
    var v = vertices[vertices.length -1 ];
    if ( loop )
    {
        v = vertices[0];
    }
    target.push( new THREE.Vector3 ( v.x, v.y, v.z ) );

    return target;

};

function QuadraticBezier(){}
/**
 *
 * @param vertices
 * @param precision
 * @param loop
 * @param target
 * @returns {*|Vector}
 */
QuadraticBezier.compute = function( vertices, precision, loop, target)
{

    precision =  Math.max( .01, Math.min( 1, precision ||.1 ) );

    loop = loop || false;

    //output values
    target = target || [];
    
    var p03D = new THREE.Vector3();
    var p13D = new THREE.Vector3();
    var p23D = new THREE.Vector3();
    
    var i = 0;
    var j, t, t2, t3, t4;
    var X, Y, Z;
    
    while( i < vertices.length )
    {
    
        //p0
        if( i == 0 )
        {
    
            if ( loop == true ){
    
                p0.x = (vertices[vertices.length-1].x+vertices[i].x) * .5;
                p0.y = (vertices[vertices.length-1].y+vertices[i].y) * .5;
                p0.z = (vertices[vertices.length-1].z+vertices[i].z) * .5;
    
            }else{
    
                p0.x = vertices[ i ].x;
                p0.y = vertices[ i ].y;
                p0.z = vertices[ i ].z;
            }
    
        }
        else
        {
    
            p0.x = ( vertices[ i - 1 ].x + vertices[ i ].x ) * .5;
            p0.y = ( vertices[ i - 1 ].y + vertices[ i ].y ) * .5;
            p0.z = ( vertices[ i - 1 ].z + vertices[ i ].z ) * .5;
    
        }
        //p1
        p1.x = vertices[ i ].x;
        p1.y = vertices[ i ].y;
        p1.z = vertices[ i ].z;
    
        //p2	
        if( i == vertices.length - 1 )
        {
    
            if (loop == true){
    
                p2.x=(vertices[i].x+vertices[0].x) * .5;
                p2.y=(vertices[i].y+vertices[0].y) * .5;
                p2.z=(vertices[i].z+vertices[0].z) * .5;
    
            }else{
    
                p2.x = vertices[ i ].x;
                p2.y = vertices[ i ].y;
                p2.z = vertices[ i ].z;
            }
    
        }
        else
        {
    
            p2.x = ( vertices[ i + 1 ].x + vertices[ i ].x ) * .5;
            p2.y = ( vertices[ i + 1 ].y + vertices[ i ].y ) * .5;
            p2.z = ( vertices[ i + 1 ].z + vertices[ i ].z ) * .5;
    
        }
    
        j = 0;
        while( j < 1 )
        {
    
            t  = 1 - j;
            t2 = t * t;
            t3 = 2 * j * t;
            t4 = j * j;
    
            X = t2 * p0.x + t3 * p1.x + t4 * p2.x;
            Y = t2 * p0.y + t3 * p1.y + t4 * p2.y;
            Z = t2 * p0.z + t3 * p1.z + t4 * p2.z;
    
            target.push( new THREE.Vector3( X, Y, Z ) );
            j += precision;
    
        }
        i++;
    }
    if ( loop )
    {
        target.push( target[0] );
    }
    else
    {
        target.push( vertices[ vertices.length -1 ] );
    }
    return target;

};