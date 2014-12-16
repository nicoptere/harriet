varying vec2 vN;
varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vPos;
varying float vBump;

uniform float time;
uniform int type;
uniform sampler2D bump;
uniform float bumpAmount;

void main()
{

    vUv = vec2( uv.x, uv.y);

    vec4 p = vec4( position, 1. );

    vec3 e = normalize( vec3( modelViewMatrix * p ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );

    r.z += 1.0;
    float m = 2.0 * length(r);
    vN = r.xy / m + .5;

    vNorm = n;



    vec3 pos = position;
    vBump = ( length(  texture2D( bump, uv ).rgb ) * bumpAmount );
    if( type != 4 ) pos += normal * vBump;

    pos += normal * time;
    vPos = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );

}