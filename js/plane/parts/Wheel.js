var Wheel = function( element, scale )
{


    var radius = .15 + PRNG.random() * .15;

    var group = new THREE.Object3D();

    var torus = new THREE.TorusGeometry( radius,.01+PRNG.random() * 0.05,6, 64 );

    var wheel_f = new THREE.Mesh( torus, Materials.WOOD );
    group.add( wheel_f );
    var wheel_b = new THREE.Mesh( torus, Materials.WOOD );
    group.add( wheel_b );

    wheel_f.position.y = -.25;
    wheel_b.position.y = -.25;
    wheel_f.position.z = .5;
    wheel_b.position.z = -.5;

    var m = new THREE.Mesh( Part.CUBE, Materials.SEM );
    m.scale.set(.05,.05,1);
    m.rotation.x = -Math.PI/6;
    m.castShadow = true;
    group.add( m );

    var m = new THREE.Mesh( Part.CUBE, Materials.SEM );
    m.scale.set(.05,.05,1);
    m.rotation.x = Math.PI/6;
    m.castShadow = true;
    group.add( m );


    var m = new THREE.Mesh( Part.CUBE, Materials.SEM );
    m.scale.set(.05,.5, .05 );
    m.castShadow = true;
    //m.position.y -=.25;
    m.position.z -=.5;
    group.add( m );

    var m = new THREE.Mesh( Part.CUBE, Materials.SEM );
    m.scale.set(.05,.5, .05 );
    m.castShadow = true;
    //m.position.y -=.25;
    m.position.z +=.5;
    group.add( m );

    scale = scale || 1;
    group.position.y -=.5;
    group.scale.set( scale, scale, scale );
    element.add( group );

};
