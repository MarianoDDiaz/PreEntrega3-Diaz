const productos = [
  {
    id: 1,
    nombre: "Borcego",
    precio: 25000,
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/598/845/products/new-vancouver-311-machiatto-copia1-015f733136bc4e6e5216244051662592-1024-1024.webp",
    cantidad: 1,
  },
  {
    id: 2,
    nombre: "Bota",
    precio: 20000,
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/598/845/products/b5-negro_011-cbfc36e18d75f53a5c15290128448642-1024-1024.webp",
    cantidad: 1,
  },
  {
    id: 3,
    nombre: "Mocasin",
    precio: 15000,
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/598/845/products/019-marron_011-c461be3fefc698080f16378660742513-1024-1024.webp",
    cantidad: 1,
  },
  {
    id: 4,
    nombre: "Zapato",
    precio: 13000,
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/598/845/products/ramiro_011-0107ffb64cc1f1b47016833187829243-1024-1024.webp",
    cantidad: 1,
  },
];
const contenidoCarrito = document.getElementById("contenidoCarrito");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

productos.forEach((producto) => {
  let content = document.createElement("div");
  content.className = "card";
  content.innerHTML = `
    <img src="${producto.img}">
    <h3>${producto.nombre}</h3>
    <p class="price">${producto.precio} $</p>
  `;

  contenidoCarrito.append(content);

  let comprar = document.createElement("button");
  comprar.innerText = "Comprar";
  comprar.className = "comprar";

  content.append(comprar);

  comprar.addEventListener("click", () => {
    const repeat = carrito.some(
      (repeatProducto) => repeatProducto.id === producto.id
    );

    if (repeat) {
      carrito.map((prod) => {
        if (prod.id === producto.id) {
          prod.cantidad++;
        }
      });
    } else {
      carrito.push({
        id: producto.id,
        img: producto.img,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad,
      });

      carritoCounter();
      saveLocal();
    }
  });
});

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarCarrito = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "flex";
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class="modal-header-title">Carrito de compras</h1>
    `;
  modalContainer.append(modalHeader);

  const modalbutton = document.createElement("h1");
  modalbutton.innerText = "x";
  modalbutton.className = "modal-header-button";

  modalbutton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalHeader.append(modalbutton);

  carrito.forEach((producto) => {
    let carritoContent = document.createElement("div");
    carritoContent.className = "modal-content";
    carritoContent.innerHTML = `
        <img src="${producto.img}">
        <h3>${producto.nombre}</h3>
        <p>${producto.precio} $</p>
        <span class="restar"> - </span>
        <p>${producto.cantidad}</p>
        <span class="sumar"> + </span>
        <p>Total: ${producto.cantidad * producto.precio} $</p>
        <span class="delete-product"> ❌ </span>
      `;

    modalContainer.append(carritoContent);

    let restar = carritoContent.querySelector(".restar");

    restar.addEventListener("click", () => {
      if (producto.cantidad !== 1) {
        producto.cantidad--;
      }
      saveLocal();
      pintarCarrito();
    });

    let sumar = carritoContent.querySelector(".sumar");
    sumar.addEventListener("click", () => {
      producto.cantidad++;
      saveLocal();
      pintarCarrito();
    });

    let eliminar = carritoContent.querySelector(".delete-product");

    eliminar.addEventListener("click", () => {
      eliminarProducto(producto.id);
    });
  });

  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

  const totalBuying = document.createElement("div");
  totalBuying.className = "total-content";
  totalBuying.innerHTML = `Total a pagar: ${total} $`;
  modalContainer.append(totalBuying);
};

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
  const foundId = carrito.find((element) => element.id === id);

  carrito = carrito.filter((carritoId) => {
    return carritoId !== foundId;
  });

  carritoCounter();
  saveLocal();
  pintarCarrito();
};

const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

carritoCounter();
