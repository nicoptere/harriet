var Aileron = function(  )
{
    var width = 1;
    var depth = 1;
    var angle = Math.PI / 4 + PRNG.random() * Math.PI / 4;// + 30 * RAD;
    var subdivisions = random( 3, 5 );
    var tension = .75 + PRNG.random() * .5;

    var vs = [];
    var st = [];

    var tl = new THREE.Vector3( 0, 0 );
    var le = new THREE.Vector3( width, 0 );
    var bo = new THREE.Vector3( 0, depth );

    vs.push( tl );
    st.push( tl.clone() );

    var angleStep = ( angle ) / subdivisions / 2;
    var vp, sp, iteration = 0;
    for( var i = 0; i <= angle; i += angleStep )
    {

        if( iteration++ % 2 == 0 )
        {
            vp = new THREE.Vector3(
                tl.x + Math.cos( i ) * width,
                tl.y + Math.sin( i ) * depth
            );
            vs.push( vp );

            if( tension < 1 )
            {
                sp = new THREE.Vector3(
                    tl.x + Math.cos( i ) * ( width * ( 2 - tension ) ),
                    tl.y + Math.sin( i ) * ( depth * ( 2 - tension ) )
                );
                st.push( tl.clone(), sp );
            }
            else st.push( tl.clone(), vp.clone() );
        }
        else
        {
            vp = new THREE.Vector3(
                tl.x + Math.cos( i ) * width * tension,
                tl.y + Math.sin( i ) * depth * tension
            );
            vs.push( vp );

            if( tension > 1 ) st.push(tl.clone(), vp.clone() );

        }

    }
    vs.push(tl.clone() );
    vs = CatmullRom.compute( vs,.1 );
    vs.reverse();

    var structure = new Loft( st, Section.createRegularSection(.01,3), Materials.SEM );
    structure.position.z +=.005;
    structure.castShadow = true;
    this.structure = structure;

    var sail = new Extrude( new THREE.Vector3(0,0,1), vs, .01, 1, Materials.WING );
    sail.castShadow = true;
    this.sail = sail;

    var group = new THREE.Object3D();
    group.add( structure );
    group.add( sail );
    return group;



};
Aileron.prototype =
{
    clone : function()
    {
        var structure = new THREE.Mesh( this.structure.geometry, Materials.SEM );
        var sail = new THREE.Mesh( this.sail.geometry, Materials.WING );
        var group = new THREE.Object3D();
        group.add( structure );
        group.add( sail );
        return group;
    }
}