const { response, request } = require("express");
const { Producto, Categoria } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    productos,
  });
};

// obtenerProductoPorId - populate(mongose){}
const obtenerProductoPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findOne({ _id: id })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const {nombre, categoria,  ...rest} = req.body;
  rest.nombre = nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre: rest.nombre });
  const categoriaDB = await Categoria.findOne({ _id: categoria });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }
  
  const data = {
    usuario: req.usuario._id,
    categoria: categoriaDB,
    ...rest
  };

  const producto = await new Producto(data);

  //Guardar DB

  await producto.save();

  res.status(201).json(producto);
};

//actualizarProducto  - (el otro nombre no debe existir)

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { nombre, categoria, ...data } = req.body;

  data.nombre = nombre.toUpperCase();

  const nombreExiste = await Producto.findOne({ nombre: data.nombre });
  if (nombreExiste) {
    return res.status(400).json({
      msg: `El nombre ${nombre}, ya existe`,
    });
  }

  if ( categoria ) {
    const categoriaBD = await Categoria.findOne({_id: categoria})
    data.categoria = categoriaBD;
  }

  const producto = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("categoria", "nombre");

  res.json(producto);
};

//Borrar producto por id
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  ).populate("usuario", "nombre");

  res.json(producto);
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
