const contenidoCarrito = document.getElementById("contenidoCarrito");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const obtenerProductos = async () => {
  const respuesta = await fetch("data.json");
  const data = await respuesta.json();

  data.forEach((producto) => {
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
        (repeatProducto) => repeatProducto.id === producto.id,
        Swal.fire({
          text: "PRODUCTO AGREGADO",
          icon: "success",
          confirmButtonText: "Aceptar",
          iconColor: "green",
          color: "green",
        })
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
        guardarStorage();
      }
    });
  });
};

obtenerProductos();

const guardarStorage = () => {
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
      } else if (producto.cantidad === 1) {
        eliminarProducto(producto.id);
      }
      guardarStorage();
      pintarCarrito();
    });

    let sumar = carritoContent.querySelector(".sumar");
    sumar.addEventListener("click", () => {
      producto.cantidad++;
      guardarStorage();
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

  const botonComprar = document.createElement("h2");
  botonComprar.innerText = "Terminar Compra";
  botonComprar.className = "boton-comprar";

  botonComprar.addEventListener("click", () => {
    if (carrito.length === 0)
      Swal.fire({
        text: "Agregue un producto para continuar",
        icon: "error",
        confirmButtonText: "Aceptar",
        iconColor: "red",
        color: "red",
      }); else { 
        Swal.fire({
        text: "Compra realizada",
        icon: "success",
        confirmButtonText: "Aceptar",
        iconColor: "green",
        color: "green",
        
      });
  }})

  modalContainer.append(botonComprar);
};

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
  const foundId = carrito.find((element) => element.id === id);

  carrito = carrito.filter((carritoId) => {
    return carritoId !== foundId;
  });
  carritoCounter();
  guardarStorage();
  pintarCarrito();
};

const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

carritoCounter();
