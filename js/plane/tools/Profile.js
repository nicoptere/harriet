var Profile = function()
{
    this.vertices = [];
    this.structure = [];


};
Profile.prototype =
{
    clone : function()
    {
        var profile = new Profile();
        this.vertices.forEach( function(v){   profile.vertices.push(v.clone() );  });
        this.structure.forEach( function(v){   profile.structure.push(v.clone() );  });
        return profile;
    }
};

Profile.getWingTip = function( width, depth, angle, subdivisions, tension )
{

    var profile = new Profile();

    var vs = profile.vertices;
    var st = profile.structure;

    var tl = new Point( 0, 0 );
    var le = new Point( width, 0 );
    var bo = new Point( 0, depth );


    vs.push( tl );
    st.push( tl.clone() );

    var angleStep = ( angle ) / subdivisions / 2;
    var vp, sp, iteration = 0;
    for( var i = 0; i <= angle; i += angleStep )
    {

        if( iteration++ % 2 == 0 )
        {
            vp = new Point(
                tl.x + Math.cos( i ) * width,
                tl.y + Math.sin( i ) * depth
            );
            vs.push( vp );

            if( tension < 1 )
            {
                sp = new Point(
                    tl.x + Math.cos( i ) * ( width * ( 2 - tension ) ),
                    tl.y + Math.sin( i ) * ( depth * ( 2 - tension ) )
                );
                st.push( tl.clone(), sp );
            }
            else st.push( tl.clone(), vp.clone() );
        }
        else
        {
            vp = new Point(
                tl.x + Math.cos( i ) * width * tension,
                tl.y + Math.sin( i ) * depth * tension
            );
            vs.push( vp );

            if( tension > 1 ) st.push(tl.clone(), vp.clone() );

        }

    }
    //vs.push( tl.clone() );



    return profile;
};


Profile.getWingModule = function( width, depth, subdivisions, tension )
{

    var profile = new Profile();

    var vs = profile.vertices;
    var st = profile.structure;

    var tl = new Point( 0, 0 );
    var le = new Point( width, 0 );
    var bo = new Point( 0, depth );


    vs.push( tl );
    st.push( tl.clone() );

    var subdivsionStep = ( depth ) / subdivisions / 2;
    var vp, sp, iteration = 0;
    for( var i = 0; i <= depth; i += subdivsionStep )
    {

        if( iteration++ % 2 == 0 )
        {
            vp = new Point(
                tl.x + width,
                tl.y + i
            );
        }
        else
        {
            vp = new Point(
                tl.x +  width * ( 2 - tension ),
                tl.y +  i
            );
        }

        vs.push( vp );
        sp = new Point(
            tl.x ,
            i
        );
        st.push( vp.clone(), sp );

    }

    //vs.push( bo, tl.clone() );
    return profile;
};

Profile.offset = function( profile, axis, amount )
{
    var i, p, t;
    for( i = 0; i < profile.vertices.length; i++ )
    {
        p = profile.vertices[ i ];
        p[ axis ] += amount;
    }
    for( i = 0; i < profile.structure.length; i++ )
    {
        p = profile.structure[ i ];
        p[ axis ] += amount;
    }

    return profile;
};
Profile.switchAxis = function( profile, a, b )
{
    var i, p, t;
    for( i = 0; i < profile.vertices.length; i++ )
    {
        p = profile.vertices[ i ];
        t = p[ b ];
        p[ b ] = p[ a ];
        p[ a ] = t;
    }
    for( i = 0; i < profile.structure.length; i++ )
    {
        p = profile.structure[ i ];
        t = p[ b ];
        p[ b ] = p[ a ];
        p[ a ] = t;
    }

    return profile;
};
Profile.flipAxis = function( profile, axis )
{
    var i, p, t;
    for( i = 0; i < profile.vertices.length; i++ )
    {
        p = profile.vertices[ i ];
        p[ axis ] *= -1;
    }
    for( i = 0; i < profile.structure.length; i++ )
    {
        p = profile.structure[ i ];
        p[ axis ] *= -1;
    }
    return profile;
};
