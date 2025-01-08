let filterLength = 30;  // Longitud del filtro
let bodyLength = 80;    // Longitud inicial del cuerpo del cigarro
let initialBodyLength = 80; // Longitud inicial del cuerpo del cigarro (para reiniciar)
let tipLength = 10;     // Longitud de la punta de ceniza
let emberWidth = 10;    // Ancho del fuego (prisma rectangular)
let emberHeight = 5;    // Alto del fuego (prisma rectangular)
let emberLength = 10;   // Largo del fuego (prisma rectangular)
let smokeParticles = []; // Array para partículas de humo
let scrollConsumeSpeed = 0.2;   // Velocidad de consumo por scroll (ajustable)
let maxBodyLength = 80; // Longitud máxima del cigarro
let minBodyLength = 10; // Longitud mínima del cigarro
let opacity = 255;      // Opacidad de los bloques
let particleSpawnRate = 0.05; // Tasa de aparición de partículas de humo
let maxParticles = 100; // Límite máximo de partículas de humo
let letters = [];       // Array para almacenar las letras tridimensionales

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function preload() {
  font = loadFont('Staatliches-Regular.ttf');
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Configura la cámara para un perfil de 3/4
  let camX = 200;
  let camY = -150;
  let camZ = 200;
  let centerX = 0;
  let centerY = 0;
  let centerZ = 0;
  let upX = 0;
  let upY = 1;
  let upZ = 0;

  camera(camX, camY, camZ, centerX, centerY, centerZ, upX, upY, upZ);

  // Inicializar las letras con sus velocidades de rotación
  let text = "PUCHITO.COM.AR";
  for (let i = 0; i < text.length; i++) {
    letters.push({
      char: text[i],
      rotationX: random(0.01, 0.05) * (random() > 0.5 ? 1 : -1),
      rotationY: random(0.01, 0.05) * (random() > 0.5 ? 1 : -1),
      rotationZ: random(0.01, 0.05) * (random() > 0.5 ? 1 : -1),
      angleX: 0,
      angleY: 0,
      angleZ: 0
    });
  }
}

function draw() {
  background(0); // Fondo negro

  // Configura la iluminación
  pointLight(125, 255, 125, 200, -150, 270); // Luz puntual principal
  pointLight(125, 125, 255, -107, 230, -304); // Luz puntual secundaria
  pointLight(255, 125, 125, 331, 222, -163); // Luz puntual secundaria

  // Controla la cámara
  orbitControl(4, 4, 0); 

  // Dibuja el cigarro
  drawCigarette();

  // Crear y dibujar el humo
  createSmoke();
  drawSmoke();

  // Dibujar las letras tridimensionales
  drawLetters();
}

function drawCigarette() {
  push();
  noStroke();
  translate(0, 0, -filterLength / 2);

  // Filtro
  fill(150, 75, 0, opacity); // Marrón con opacidad
  box(20, 20, filterLength);

  // Cuerpo del cigarro
  fill(255, opacity); // Blanco con opacidad
  translate(0, 0, filterLength / 2 + bodyLength / 2);
  box(20, 20, bodyLength);

  // Punta de ceniza
  fill(150, opacity); // Gris con opacidad
  translate(0, 0, bodyLength / 2 + tipLength / 2);
  box(20, 20, tipLength);

  // Brasa (fuego) como prisma rectangular
  fill(255, 50, 50, opacity); // Rojo brillante con opacidad
  translate(0, 0, tipLength / 2 + emberLength / 2);
  box(emberWidth, emberWidth, emberLength); // Prisma rectangular

  pop();
}

function createSmoke() {
  // Crear nuevas partículas de humo gradualmente
  if (smokeParticles.length < maxParticles) {
    for (let i = 0; i < particleSpawnRate; i++) {
      smokeParticles.push({
        pos: createVector(0, 0, bodyLength + tipLength + emberLength / 2), // Partículas empiezan en la posición del fuego
        vel: createVector(random(-0.05, 0.05), random(-0.3, -0.15), random(-0.015, 0.015)), // Velocidad variable
        size: random(0.25, 2), // Tamaño variable y más chico
        life: random(150, 400), // Duración de vida de cada partícula       
        swingOffset: random(10000), // Desplazamiento para el swing aleatorio
        swingSpeed: random(70, 100) // Velocidad de oscilación
      });
    }
  }
}

function drawSmoke() {
  push();
  noStroke();
  fill(200, 200, 200, 100); // Gris claro y menos opaco

  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    let particle = smokeParticles[i];

    // Añadir oscilación a la posición de la partícula
    particle.pos.x += sin(particle.swingOffset + frameCount * particle.swingSpeed) * 0.5;
    particle.pos.z += cos(particle.swingOffset + frameCount * particle.swingSpeed) * 0.5;

    push();
    translate(particle.pos.x, particle.pos.y, particle.pos.z);
    sphere(particle.size); // Tamaño variable de las partículas de humo
    pop();

    // Actualiza la posición y vida de las partículas
    particle.pos.add(particle.vel);
    particle.life--;

    if (particle.life <= 0) {
      smokeParticles.splice(i, 1); // Remover partículas muertas
    }
  }
  pop();
}

function drawLetters() {
  push();
  translate(0, -50, -filterLength - 100); // Posicionar letras detrás y encima del cigarro

  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];
    push();
    translate((i - letters.length / 2) * 30, 0, 0); // Espaciado entre letras

    // Rotar cada letra
    letter.angleX += letter.rotationX;
    letter.angleY += letter.rotationY;
    letter.angleZ += letter.rotationZ;
    rotateX(letter.angleX);
    rotateY(letter.angleY);
    rotateZ(letter.angleZ);

    // Dibujar letra
    fill(255, 255, 0); // Amarillo brillante
    textSize(20);
    textFont(font);
    textAlign(CENTER, CENTER);
    text(letter.char, 0, 0);
    pop();
  }
  pop();
}

function mouseWheel(event) {
  // Ajustar la longitud del cigarro según el scroll
  let scrollDelta = event.delta * 0.01 * scrollConsumeSpeed; // Ajustar sensibilidad del scroll
  bodyLength = constrain(bodyLength - scrollDelta, minBodyLength, maxBodyLength);

  // Prevenir que el scroll afecte el desplazamiento del navegador
  return false;
}

