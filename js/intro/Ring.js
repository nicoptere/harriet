var Ring = function()
{
    THREE.Object3D.call( this );

    var p0 = new THREE.Vector3( 0,0,0.5 );
    var p1 = new THREE.Vector3( 0,0,-.5);
    var path = new THREE.SplineCurve3( [p0, p1] );
    this.ring = new THREE.Mesh( new THREE.TorusGeometry( 2.5,.35, 16, 64 ), Materials.RING );
    this.ring.scale.set( 1,1,.32 );
    this.add( this.ring );


    this.content = new World( this );//new THREE.Mesh( new THREE.IcosahedronGeometry( 2.5, 3 ), Materials.GLOBE );
    this.content.container.scale.set( 2.35,2.35,.35 );
    Stage3d.add( this.content.container );

    this.portrait = new THREE.Mesh( new THREE.SphereGeometry( 2.5, 64,32, 0, Math.PI ), Materials.PORTRAIT );
    this.portrait.scale.set( 1,1,.21 );
    this.add( this.portrait );

    this.ring.castShadow =
    this.content.castShadow =
    this.portrait.castShadow = true;

    var arcgeo = new THREE.TorusGeometry( 2.75,.1,3,32, Math.PI );

    //var arc0 = new THREE.Mesh( arcgeo, Materials.RING );
    //arc0.rotation.x = Math.PI / 2;
    //var arc1 = new THREE.Mesh( arcgeo, Materials.RING );
    //arc1.rotation.x = Math.PI / 2;
    //arc1.rotation.y = Math.PI / 2;
    //this.add( arc0 );
    //this.add( arc1 );


    //this.ring.recieveShadow =
    //this.content.recieveShadow =
    //this.portrait.recieveShadow = true;

    Stage3d.add( this );

};
Ring.prototype = Object.create( THREE.Object3D.prototype );