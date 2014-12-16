var Direction = function( element )
{
    var a = new Aileron();
    a.scale.multiplyScalar( 1 + PRNG.random() * 2 );
    element.sail = a;
    element.add( a );

    var m = new THREE.Mesh( Part.CUBE, Part.MAT );
    m.position.set( 0,0,0 );
    m.scale.set( .05,.05,1 );
    m.castShadow = true;
    element.add( m );

    element.pivots = {

        front :
        {
            left :      element.position,
            center :    element.position,
            right :     element.position
        },
        back :
        {
            left :      element.position,
            center :    element.position,
            right :     element.position
        }

    };
};

