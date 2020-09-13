import * as three from './three.module.js'
import {
    GLTFLoader
} from './GLTFLoader.js'
import {
    OrbitControls
} from './OrbitControls.js'
import anime from './anime.es.js'

const mainBtn = document.querySelector('.main__block button')
const backBtn = document.querySelector('button.back')

let mainIntervals
let secondIntervals

const width = window.innerWidth;
const height = window.innerHeight;
let scene, hemilight, camera, renderer, orbitControls, model, spotLight


function init() {
    //create scene
    scene = new three.Scene()
    scene.background = new three.Color(0xdddddd)

    //add camera to scene
    camera = new three.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 20
    camera.position.y = 8
    scene.add(camera)

    //add hemi light
    hemilight = new three.HemisphereLight('#FDB813', '#696969', 4)
    scene.add(hemilight)

    //add spot light
    spotLight = new three.SpotLight(0xffff, 4)
    spotLight.castShadow = true
    spotLight.shadow.bias = -0.0001
    spotLight.shadow.mapSize.width = 1024 * 4
    spotLight.shadow.mapSize.height = 1024 * 4
    scene.add(spotLight)

    //axis helper
    // scene.add(new three.AxesHelper(5000))

    //create renderer function
    renderer = new three.WebGLRenderer()
    renderer.toneMapping = three.ReinhardToneMapping
    renderer.toneMappingExposure = 2.3
    renderer.shadowMap.enabled = true
    renderer.setSize(width, height)
    document.body.appendChild(renderer.domElement)

    //add orbit controls to scene
    // orbitControls = new OrbitControls(camera, renderer.domElement)

    //add 3d model
    new GLTFLoader().load('3dModel/scene.gltf', gltf => {
        model = gltf.scene.children[0]
        model.traverse(n => {
            if (n.isMesh) {
                n.castShadow = true
                n.receiveShadow = true
                if (n.material.map) n.material.map.anisotropy = 16
            }
        })
        scene.add(gltf.scene)
        model.position.x = 15
        animate()
    })

}

function animate() {
    renderer.render(scene, camera)
    model.rotation.z += 0.005
    spotLight.position.z += camera.position.z + 10
    requestAnimationFrame(animate)
}

window.addEventListener('resize', e => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)
init()


anime({
    targets: '.main__block',
    translateX: 0,
})


anime({
    targets: '.main__block button',
    direction: 'alternate',
    scale: 1.1,
    easing: 'easeInOutSine',
    loop: true,
})


mainBtn.addEventListener('click', e => {
    if(secondIntervals){
        clearInterval(secondIntervals)
    }
    anime({
        targets: '.main__block',
        translateX: -1000,
        duration: 100
    })
    mainIntervals = setInterval(() => {
        if(camera.position.z > -1){
            return camera.position.z -= 0.02
        }
    }, 0)
    anime({
        targets: '.require__list',
        scale: 1.1,
    })
    anime({
        targets: '.back',
        translateX: 0,
        duration: 500
    })
})

backBtn.addEventListener('click', e => {
    clearInterval(mainIntervals)
    anime({
        targets: '.require__list',
        scale: 0,
        duration: 0
    })
    secondIntervals = setInterval(() => {
        if(camera.position.z < 20){
            camera.position.z += 0.02
        }
    }, 0)
    anime({
        targets: '.back',
        translateX: -500,
        duration: 500
    })
    anime({
        targets: '.main__block',
        translateX: 0,
        duration: 2000
    })
})
