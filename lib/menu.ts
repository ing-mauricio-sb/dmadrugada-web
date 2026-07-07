// DRAFT menu — typical Chiclayo madrugada fare. All prices [draft — confirmar].
// Replace names / descriptions / prices with the real carta de D'Madrugada.

export type MenuItem = {
  name: string;
  desc: string;
  price: number; // soles (S/)
  img?: string; // optional thumbnail in /public/food
  tag?: "top" | "nuevo";
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    id: "alitas",
    label: "Alitas",
    items: [
      { name: "Alitas BBQ x8", desc: "Crocantes por fuera, jugosas por dentro.", price: 18, img: "/food/alitas.jpg", tag: "top" },
      { name: "Alitas Honey Mustard x8", desc: "Dulce y ahumado, para caer rendido.", price: 18 },
      { name: "Alitas Buffalo x8", desc: "Picantitas para despertar la madrugada.", price: 18 },
      { name: "Combo alitas + papas", desc: "8 alitas + papas + cremas.", price: 22, tag: "top" },
    ],
  },
  {
    id: "broaster",
    label: "Broaster",
    items: [
      { name: "¼ Broaster + papas", desc: "Dorado, caliente, sin excusas.", price: 16, img: "/food/broaster.jpg", tag: "top" },
      { name: "⅛ Broaster", desc: "El clásico para el antojo exacto.", price: 10 },
      { name: "Combo familiar", desc: "Broaster + papas + gaseosa 1L.", price: 45 },
    ],
  },
  {
    id: "chaufas",
    label: "Chaufas & Arroces",
    items: [
      { name: "Chaufa de pollo", desc: "El wok que salva la madrugada.", price: 15, img: "/food/chaufa.jpg", tag: "top" },
      { name: "Chaufa mixto", desc: "Pollo, carne y chancho al wok.", price: 18 },
      { name: "Aeropuerto", desc: "Chaufa + tallarín saltado en un plato.", price: 17 },
      { name: "Arroz chaufa especial", desc: "Con huevo, tocino y toque de la casa.", price: 20 },
    ],
  },
  {
    id: "salchipapas",
    label: "Salchipapas & Piqueos",
    items: [
      { name: "Salchipapa clásica", desc: "Papa dorada + salchicha + cremas.", price: 12 },
      { name: "Salchipapa D'Madrugada", desc: "Con todo: huevo, queso y más.", price: 18, tag: "top" },
      { name: "Mollejitas", desc: "Doraditas y bien sazonadas.", price: 15 },
      { name: "Papa rellena", desc: "Rellena de carne, para el camino.", price: 8 },
    ],
  },
  {
    id: "hamburguesas",
    label: "Hamburguesas",
    items: [
      { name: "Hamburguesa clásica", desc: "Carne, queso, huevo y papas al hilo.", price: 12 },
      { name: "Hamburguesa D'Madrugada", desc: "Doble carne para el hambre real.", price: 14, img: "/food/burger.jpg", tag: "top" },
      { name: "Royal", desc: "Doble queso y tocino crocante.", price: 16 },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    items: [
      { name: "Gaseosa personal", desc: "Bien helada, cualquier sabor.", price: 5 },
      { name: "Gaseosa 1L", desc: "Para compartir la trasnochada.", price: 9 },
      { name: "Chicha morada", desc: "De la casa, jarra fresca.", price: 6 },
      { name: "Agua mineral", desc: "Con o sin gas.", price: 3 },
    ],
  },
];

export const formatPrice = (soles: number) =>
  soles % 1 === 0 ? `S/ ${soles}` : `S/ ${soles.toFixed(2)}`;
