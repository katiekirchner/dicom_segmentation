console.log("what the fuck")
var elem = document.getElementById('test');

var paths =[
    './images/0_heart.stl',
    './images/liver.stl',
    './images/top_skeleton.stl'


]


for(let x in paths){
    all(paths[x]);
}



function all(path){


    var container, camera, scene, renderer, controls;

    init(path);
    animate();

    function init(path) {

        container = document.createElement( 'div' );
        elem.appendChild( container );

        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( 600, 500);
        container.appendChild( renderer.domElement );

        // scene

        scene = new THREE.Scene();





        // camera

        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 0, 0, 0 );
        scene.add( camera ); // required, because we are adding a light as a child of the camera




        // controls = new THREE.TrackballControls( camera );
        // controls.addEventListener( 'change', render );


        // lights

        scene.add( new THREE.AmbientLight( 0x222222 ) );

        var light = new THREE.PointLight( 0xffffff, 0.8 );
        camera.add( light );

        // object

        var loader = new THREE.STLLoader();
        loader.load( path, function ( geometry ) {

            var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );

            var mesh = new THREE.Mesh( geometry, material );

            scene.add( mesh );

        } );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        requestAnimationFrame( animate );
        // controls.update();

        render();

    }

    function render() {

        var timer = Date.now() * 0.000005;

        // camera.position.x = -0.5;
        camera.position.x = -0.5;
        camera.position.y = 0.1;
        camera.position.z = 2.0;
        


        console.log("ahhhh ",camera.position)
        camera.lookAt( scene.position );

        renderer.render( scene, camera );

    }

}



