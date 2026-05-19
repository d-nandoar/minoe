// js/products.js
// BASE DE DATOS DE PRODUCTOS INDEPENDIENTE - MINOE LUXURY

const inventory = {
  joyeria: [
    {
      id: "JW-01", // Un identificador único para que el código no se confunda de producto
      name: "Anillo Diamante Real", // Nombre que verá el usuario
      price: 1250, // Precio numérico para poder hacer cálculos matemáticos
      img: "assets/img/joy.png", // La ruta de la imagen para mostrarla en el HTML
    },
    {
      id: "JW-02",
      name: "Collar Oro 18k",
      price: 890,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-03",
      name: "Aretes Perla Lux",
      price: 340,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-04",
      name: "Pulsera Tenis Diamantes",
      price: 2100,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-05",
      name: "Reloj Gold Classic",
      price: 560,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-06",
      name: "Anillo Esmeralda",
      price: 950,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-07",
      name: "Gargantilla Plata",
      price: 120,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-08",
      name: "Broche Vintage",
      price: 280,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-09",
      name: "Reloj Black Limited",
      price: 720,
      img: "assets/img/joy.png",
    },
    {
      id: "JW-10",
      name: "Pendientes Zafiro",
      price: 1100,
      img: "assets/img/joy.png",
    },
  ],
  studio: [
    {
      id: "ST-01",
      name: "Cartera Cuero Grained",
      price: 280,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-02",
      name: "Zapatos Oxford Piel",
      price: 195,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-03",
      name: "Bolso Tote Black",
      price: 150,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-04",
      name: "Cinturón Executive",
      price: 85,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-05",
      name: "Portafolio Minimal",
      price: 210,
      img: "assets/img/stud.png  ",
    },
    {
      id: "ST-06",
      name: "Gafas de Sol Urban",
      price: 120,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-07",
      name: "Clutch Gala Gold",
      price: 320,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-08",
      name: "Sombrero Fedora Piel",
      price: 95,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-09",
      name: "Mocasines Italianos",
      price: 180,
      img: "assets/img/stud.png",
    },
    {
      id: "ST-10",
      name: "Bufanda Cashmere",
      price: 140,
      img: "assets/img/stud.png",
    },
  ],
  gourmet: [
    {
      id: "LC-01",
      name: "Rompope Vainilla Real",
      price: 35,
      img: "assets/img/gour.png ",
    },
    {
      id: "LC-02",
      name: "Rompope Café Espresso",
      price: 35,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-03",
      name: "Whisky Single Malt",
      price: 120,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-04",
      name: "Vino Tinto Reserva",
      price: 45,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-05",
      name: "Ginebra Premium Blue",
      price: 65,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-06",
      name: "Licor de Cacao Lux",
      price: 28,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-07",
      name: "Vodka Artesanal",
      price: 50,
      img: "assets/img/gour.png ",
    },
    {
      id: "LC-08",
      name: "Espumante Rosé",
      price: 55,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-09",
      name: "Tequila Añejo Crystal",
      price: 90,
      img: "assets/img/gour.png",
    },
    {
      id: "LC-10",
      name: "Ron Añejo 12 años",
      price: 75,
      img: "assets/img/gour.png",
    },
  ],
  regalos: [
    {
      id: "RG-01",
      name: "Cesta Gourmet Minoe",
      price: 180,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-02",
      name: "Caja de Bombones Gold",
      price: 45,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-03",
      name: "Kit de Escritorio Piel",
      price: 95,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-04",
      name: "Vela Aromática Black",
      price: 30,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-05",
      name: "Set de Té Imperial",
      price: 110,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-06",
      name: "Agenda Cuero 2026",
      price: 40,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-07",
      name: "Caja de Té de Madera",
      price: 65,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-08",
      name: "Kit Sommelier Silver",
      price: 130,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-09",
      name: "Difusor Ultrasónico",
      price: 75,
      img: "assets/img/setreg.png",
    },
    {
      id: "RG-10",
      name: "Manta de Alpaca",
      price: 220,
      img: "assets/img/setreg.png",
    },
  ],
};
