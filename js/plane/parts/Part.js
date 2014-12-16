
var Part = function( pos, type )
{
    THREE.Object3D.call( this );

    pos = pos || new THREE.Vector3();
    this.position.copy( pos );
    this.origin = pos.clone();

    this.castShadow = true;

    this.height = 1;
    this.width = 1;
    this.depth = 1;

    //corners
    this.tl = new THREE.Vector3( -.5,  .5 );
    this.tr = new THREE.Vector3(  .5,  .5 );
    this.bl = new THREE.Vector3( -.5, -.5 );
    this.br = new THREE.Vector3(  .5, -.5 );

    //pivots
    this.pivots = {

        front :
        {
            left : new THREE.Vector3(   pos.x - .4, pos.y,  pos.z + .5 ),
            center : new THREE.Vector3( pos.x     , pos.y,  pos.z + .5 ),
            right : new THREE.Vector3(  pos.x + .4, pos.y,  pos.z + .5 )
        },
        back :
        {
            left : new THREE.Vector3(   pos.x - .4, pos.y, pos.z - .5 ),
            center : new THREE.Vector3( pos.x     , pos.y, pos.z - .5 ),
            right : new THREE.Vector3(  pos.x + .4, pos.y, pos.z - .5 )
        }

    };


    this.type               = type || 0;

    Part.CYLINDER = new THREE.CylinderGeometry(.5,.5,1,16,1 );
    Part.CUBE = new THREE.BoxGeometry( 1,1,1 );
    Part.MAT = Materials.SEM;// new THREE.MeshLambertMaterial( { transparent:true, opacity:1, side:THREE.DoubleSide, wireframe:false } );//
    Part.WINGS = new THREE.MeshLambertMaterial( { transparent:true, opacity:1, side:THREE.DoubleSide, wireframe:false } );//
    Part.MAT_LINE =  new THREE.LineBasicMaterial( { color:0x303030 } );

    if( Plane3d.container != null ) Plane3d.container.add( this );

    this.hasWings = false;
    this.hasWheels = false;
    this.propeller = null;
    this.sail = null;

    if( this.type != T.EMPTY )
    {
        GeometryLoader.getElement( this );
    }
    else
    {

        //this.mesh = new THREE.Mesh( Part.CUBE, Part.MAT );
        //this.mesh.scale.set(.5,.5,.5)
        //this.add( this.mesh );
    }

    this.init();


};
Part.prototype = Object.create( THREE.Object3D.prototype );
var quaternion = new THREE.Quaternion();


Part.prototype.init = function()
{

    var PI2 = Math.PI * 2;
    var D2R = Math.PI / 180;
    var PHI = .5 * D2R;

    this.sailsAngle = PRNG.random() * Math.PI * 2;
    this.radius = .01 + ( PRNG.random() ) * .05;
    this.angle  = new THREE.Euler( PRNG.random() * PI2, PRNG.random() * PI2, PRNG.random() * PI2 );
    this.speed  = PRNG.random() * PHI;


};

Part.prototype.animate = function(deltatime)
{
    ///*
    this.angle.x += this.speed;
    this.angle.y += this.speed;
    this.angle.z += this.speed;

    this.position.set( 1,0,0 );
    quaternion.setFromEuler( this.angle );
    this.position.applyQuaternion( quaternion );
    this.position.normalize();
    this.position.multiplyScalar( this.radius).add( this.origin );

    //*/

    var x = this.position.x;
    var y = this.position.y;
    var z = this.position.z;

    this.tl.x = x - .5;
    this.tl.y = y + .5;
    this.tr.x = x + .5;
    this.tr.y = y + .5;
    this.bl.x = x - .5;
    this.bl.y = y - .5;
    this.br.x = x + .5;
    this.br.y = y - .5;

    if( this.type != T.DIRECTION )
    {

        var k;
        this.pivots.front.left.x = x - .4;
        this.pivots.front.right.x = x + .4;
        this.pivots.back.left.x = x - .4;
        this.pivots.back.right.x = x + .4;
        for( k in this.pivots.front )
        {
            this.pivots.front[ k ].y = y;
            this.pivots.front[ k ].z = z + .5;
        }
        for( k in this.pivots.back  )
        {
            this.pivots.back[ k ].y = y;
            this.pivots.back[ k ].z = z - .5;
        }

    }
    else
    {
        this.pivots = {

            front :
            {
                left :      this.position,
                center :    this.position,
                right :     this.position
            },
            back :
            {
                left :      this.position,
                center :    this.position,
                right :     this.position
            }

        };
    }

    if( this.type == T.ENGINE || this.type == T.EXTRA_ENGINE )
    {
        if( this.propeller != null ) this.propeller.rotation.z += RAD * 7;
    }

    if( this.type == T.BLOCK)
    {
        this.rotation.z =  Math.sin( this.sailsAngle + Date.now() * 0.001 ) * 5 * RAD;
    }

    if( this.type == T.DIRECTION)
    {
        if( this.sail != null ) this.sail.rotation.y = Math.sin( Date.now() * 0.001+ this.sailsAngle ) * 5 * RAD ;
    }

    ///
    //this.leftPivot.x = x - .4;
    //this.leftPivot.y = y;
    //this.leftPivot.z = z - .5;
    //
    //this.centerPivot.x = x;
    //this.centerPivot.y = y;
    //
    //this.rightPivot.x = x + .4;
    //this.rightPivot.y = y;

};

Part.prototype.dispose = function()
{
    delete this;
};
