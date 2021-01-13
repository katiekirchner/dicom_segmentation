console.log("what the fuck")
var elem = document.getElementById('test');









var container, camera, scene, renderer;

            init();
            animate();

            function init() {

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

                // lights

                scene.add( new THREE.AmbientLight( 0x222222 ) );

                var light = new THREE.PointLight( 0xffffff, 0.8 );
                camera.add( light );

                // object

                var loader = new THREE.STLLoader();
                loader.load( './images/liver.stl', function ( geometry ) {

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
























// var THREE = require('three');

// var elem = document.getElementById('test');





// var scene = new THREE.Scene();

// // Create a basic perspective camera
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera.position.z = 4;

// // Create a renderer with Antialiasing
// var renderer = new THREE.WebGLRenderer({antialias:true});

// // Configure renderer clear color
// renderer.setClearColor("#000000");

// // Configure renderer size
// renderer.setSize( elem.innerWidth, elem.innerHeight );

// // Append Renderer to DOM
// elem.appendChild( renderer.domElement );

// // ------------------------------------------------
// // FUN STARTS HERE
// // ------------------------------------------------

// // Create a Cube Mesh with basic material
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
// var cube = new THREE.Mesh( geometry, material );

// // Add cube to Scene
// scene.add( cube );

// // Render Loop
// var render = function () {
//   requestAnimationFrame( render );

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   // Render the scene
//   renderer.render(scene, camera);
// };


// render();
// var container, camera, scene, renderer;

// init();
// animate();

// function init() {
//     var THREE = require('three')
//     var STLLoader = require('three-stl-loader')(THREE)

//   container = document.createElement("div");
//   document.body.appendChild(container);

//   // renderer

//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   container.appendChild(renderer.domElement);

//   // scene

//   scene = new THREE.Scene();

//   // camera

//   camera = new THREE.PerspectiveCamera(
//     35,
//     window.innerWidth / window.innerHeight,
//     1,
//     10000
//   );
//   camera.position.set(3, 0.5, 3);
//   scene.add(camera); // required, because we are adding a light as a child of the camera

//   // lights

//   scene.add(new THREE.AmbientLight(0x222222));

//   var light = new THREE.PointLight(0xffffff, 0.8);
//   camera.add(light);

//   // object

//   var loader = STLLoader;
//   loader.load("###", function(geometry) {
//     var material = new THREE.MeshPhongMaterial({ color: 0xff5533 });

//     var mesh = new THREE.Mesh(geometry, material);

//     scene.add(mesh);
//   });

//   window.addEventListener("resize", onWindowResize, false);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;

//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//   requestAnimationFrame(animate);

//   render();
// }

// function render() {
//   var timer = Date.now() * 0.0005;

//   camera.position.x = Math.cos(timer) * 5;
//   camera.position.z = Math.sin(timer) * 5;

//   camera.lookAt(scene.position);

//   renderer.render(scene, camera);
// }






































// var elem = document.getElementById('test');
//           var THREE = require('three')
//           var STLLoader = require('three-stl-loader')(THREE)

//           var scene = new THREE.Scene();
        //   var renderer = new THREE.WebGLRenderer();
        //   var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //   var loader = new STLLoader()
        //   var degree = Math.PI/180;













          // console.log("here ",scene, loader)


        //   renderer.setSize(800, 800);
        //   elem.appendChild(renderer.domElement);



          // loader.load('./images/liver.stl', function (geometry) {
          //   var material = new THREE.MeshNormalMaterial()
          //   var mesh = new THREE.Mesh(geometry, material)
          //   scene.add(mesh)

          //   console.log(geometry, mesh)
          // })

          // var plane = new THREE.Mesh(
          //     new THREE.PlaneBufferGeometry(500, 500 ),
          //     new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
          // );

          // plane.rotation.x = -90 * degree;
          // plane.position.y = 0;
          // plane.receiveShadow = true;
          // loader.load('./images/liver.stl', function (geometry) {
          //     var material = new THREE.MeshNormalMaterial()
          //     var mesh = new THREE.Mesh(geometry, material)
          //     scene.add(mesh)
          // })

          // var render = function () {
          //   console.log("render")
          //   console.log("here2 ",scene, loader)
          //   renderer.render(scene, camera);
          // };


         

          // loader.load('./images/liver.stl', function (geometry) {
          //   var material = new THREE.MeshNormalMaterial()
          //   var mesh = new THREE.Mesh(geometry, material)
          //   scene.add(mesh)
          // })

        // const elem = document.getElementById('test');

        // import * as THREE from 'https://unpkg.com/three/build/three.module.js';
        // import * as STLLoader from 'https://unpkg.com/three@0.91.0/examples/js/loaders/STLLoader.js'
      
        // const scene = new THREE.Scene();
        // // const stl = new STLLoader;

        // console.log(STLLoader)

        // var degree = Math.PI/180;

        // // Setup
        // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // var renderer = new THREE.WebGLRenderer();

        // renderer.setSize(elem.innerWidth, elem.innerHeight);
        // elem.appendChild(renderer.domElement);

 
        // Ground (comment out line: "scene.add( plane );" if Ground is not needed...)
        // var plane = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(250, 200 ),
        //     new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        // );
        // plane.rotation.x = -90 * degree;
        // plane.position.y = 0;
        // scene.add( plane );
        // plane.receiveShadow = true;

        // ASCII file - STL Import
        // var loader = new THREE.STLLoader();
        // loader.load( './stl/1.stl', function ( geometry ) {
        //     var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, specular: 0x111111, shininess: 200 } );
        //     var mesh = new THREE.Mesh( geometry, material );
        //     mesh.position.set( 0, 0, 0);
        //     scene.add( mesh );
        // } );

        // Binary files - STL Import
        // loader.load( './images/top_skeleton.stl', function ( geometry ) {
        //     geometry.center()
        //     var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF} );
        //     var mesh = new THREE.Mesh( geometry, material );
        //     mesh.position.set( 0, 0, 0);
        //     scene.add( mesh );

        //     console.log("**", mesh)
        // } );

        // Camera positioning
        // camera.position.z = 100;
        // camera.position.y = 100;
        // camera.rotation.x = -45 * degree;

        // // // Ambient light (necessary for Phong/Lambert-materials, not for Basic)
        // var ambientLight = new THREE.AmbientLight(0xffffff, 1);
        // scene.add(ambientLight);

        // // Draw scene
        // function render() {
        //     renderer.render(scene, camera);
        // };


        // render();

//         var scene = new THREE.Scene();

// // Create a basic perspective camera
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera.position.z = 4;

// // Create a renderer with Antialiasing
// var renderer = new THREE.WebGLRenderer({antialias:true});

// // Configure renderer clear color
// renderer.setClearColor("#000000");

// // Configure renderer size
// renderer.setSize( window.innerWidth, window.innerHeight );

// // Append Renderer to DOM
// document.body.appendChild( renderer.domElement );

// // ------------------------------------------------
// // FUN STARTS HERE
// // ------------------------------------------------

// // Create a Cube Mesh with basic material
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
// var cube = new THREE.Mesh( geometry, material );

// // Add cube to Scene
// scene.add( cube );

// // Render Loop
// var render = function () {
//   requestAnimationFrame( render );

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   // Render the scene
//   renderer.render(scene, camera);
// };
