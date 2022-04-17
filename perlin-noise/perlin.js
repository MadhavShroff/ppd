var arrowRight = document.querySelector("#right");
var arrowDown = document.querySelector("#down");
var wrapper = document.querySelector("body > div.wrapper");

document.addEventListener('scroll', function (e) { // Set arrow direction based on window scroll location
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    document.querySelector("#down").style.transform = "rotate(180deg)";
  } else {
    document.querySelector("#down").style.transform = "rotate(0deg)";
  }
  if(window.scrollX < document.querySelector("body > div.wrapper").offsetWidth) {
    document.querySelector("#right").style.transform = "rotate(0deg)";
  } else {
    document.querySelector("#right").style.transform = "rotate(180deg)";
  }
});

$(document).ready(function() {
  document.querySelector("#right").onclick = () => {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  };
  document.querySelector("#down").onclick = () => {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  };
});

//--------------------------------------------------------------------
// Three JS

window.addEventListener('load', init, false);

var dataUrl;

function init() {
  createWorld();
  createPrimitive();
  animation();

  canvas = document.querySelector('canvas')
  canvas.style.width='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  dataUrl = canvas.toDataURL();
}

var Theme = {_darkred: 0x000000}

//--------------------------------------------------------------------

var scene, camera, renderer, container;
var start = Date.now();
var _width, _height;
function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  //---
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(Theme._darkred, 8, 20);
  scene.background = new THREE.Color(Theme._darkred);
  //---
  camera = new THREE.PerspectiveCamera(55, _width/_height, 1, 1000);
  camera.position.z = 11;
  //---
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setSize(_width, _height);
  //---
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);
  //---
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  canvas.style.minWidth='100vw';
  canvas.style.minHeight='105vh';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
}

//--------------------------------------------------------------------

var mat;
var primitiveElement = function() {
  this.mesh = new THREE.Object3D();
  mat = new THREE.ShaderMaterial( {
    wireframe: false,
    //fog: true,
    uniforms: {
      time: {
        type: "f",
        value: 0.0
      },
      pointscale: {
        type: "f",
        value: 1.0
      },
      decay: {
        type: "f",
        value: 0.1
      },
      complex: {
        type: "f",
        value: 0.3
      },
      waves: {
        type: "f",
        value: 20.0
      },
      eqcolor: {
        type: "f",
        value: 11
      },
      fragment: {
        type: "i",
        value: true
      },
      redhell: {
        type: "i",
        value: true
      }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });
  var geo = new THREE.IcosahedronBufferGeometry(3, 7);
  var mesh = new THREE.Points(geo, mat);
  
  //---
  this.mesh.add(mesh);
}

var _primitive;
function createPrimitive() {
  _primitive = new primitiveElement();
  scene.add(_primitive.mesh);
}

//--------------------------------------------------------------------

var options = {
  perlin: {
    vel: 0.002,
    speed: 0.00050,
    perlins: 1.0,
    decay: 0.10,
    complex: 0.30,
    waves: 20.0,
    eqcolor: 11.0,
    fragment: true,
    redhell: true
  },
  spin: {
    sinVel: 0.0,
    ampVel: 80.0,
  }
}

//--------------------------------------------------------------------

function animation() {
  requestAnimationFrame(animation);
  var performance = Date.now() * 0.003;
  
  _primitive.mesh.rotation.y += options.perlin.vel;
  _primitive.mesh.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel )* Math.PI / 180;
  //---
  mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
  mat.uniforms['pointscale'].value = options.perlin.perlins;
  mat.uniforms['decay'].value = options.perlin.decay;
  mat.uniforms['complex'].value = options.perlin.complex;
  mat.uniforms['waves'].value = options.perlin.waves;
  mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
  mat.uniforms['fragment'].value = options.perlin.fragment;
  mat.uniforms['redhell'].value = options.perlin.redhell;
  //---
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}